from flask import Flask, request, jsonify
from flask.ext.restful import Resource, Api
import feedparser
from datetime import datetime
from time import mktime

from app import api, db, app
from models import *

def update_feed_articles(feed):
    ret = feedparser.parse(feed.xml_url)

    for entry in ret.entries:
        href = ''
        if 'links' in entry:
            href = entry.links[-1].href
        elif 'href' in entry:
            href = entry.href
        
        if entry.get('published_parsed'):
            published_at = datetime.fromtimestamp(mktime(entry.published_parsed))
        elif entry.get('updated_parsed'):
            published_at = datetime.fromtimestamp(mktime(entry.updated_parsed))
        else:
            published_at = datetime.now()

        if Article.query.filter_by(title=entry.title, href=href).first():
            continue
            
        new_article = Article(title=entry.title, content=entry.summary, href=href, published_at=published_at)
        feed.articles.append(new_article)
        db.session.commit()

class FeedAPI(Resource):
    def get(self, feed_id):
        feed = Feed.query.get(feed_id)

        return jsonify(feed.to_dict())

    def put(self, feed_id):
        params = request.get_json()
        category_ids = params.get('categoryIds')
        feed_title = params['title']

        if Feed.query.filter_by(title=feed_title).first():
            msg = "%s already exists in database." % feed_title
            return dict(msg=msg, type="danger"), 422

        if category_ids:
            categories_to_add = Category.query.filter(Category.id.in_(category_ids)).all()
        else:
            categories_to_add = [Category.uncategorized()]

        feed = Feed.query.get(feed_id)
        feed.title = feed_title
        feed.categories = categories_to_add
        db.session.commit()

        return jsonify(id=feed_id)

    def delete(self, feed_id):
        feed = Feed.query.get(feed_id)
        db.session.delete(feed)
        db.session.commit()

        return jsonify({})

api.add_resource(FeedAPI, '/feed/<int:feed_id>')

class FeedsAPI(Resource):
    def get(self):
        feeds = Feed.query.all()

        feed_list = [feed.to_dict(with_categories=False, with_articles=False) for feed in feeds]

        return jsonify(objects=feed_list)

    def post(self):
        params = request.get_json()
        category_ids = params.get('categoryIds')

        if category_ids:
            categories_to_add = Category.query.filter(Category.id.in_(category_ids)).all()
        else:
            categories_to_add = [Category.uncategorized()]

        feed_title = params['title']
        xml_url = params['xml_url']
        html_url = params['html_url']

        new_feed = Feed(title=feed_title, xml_url=xml_url, html_url=html_url)
        [new_feed.categories.append(category) for category in categories_to_add]
        db.session.add(new_feed)
        db.session.flush()
        db.session.commit()
        
        update_feed_articles(new_feed)

        return jsonify(new_feed.to_dict())

api.add_resource(FeedsAPI, '/feeds')

class FeedArticlesAPI(Resource):
    def get(self, feed_id):
        ret = Feed.query.get(feed_id).to_dict()

        current_page = request.args.get('page') or 1
        current_page = ret['page'] = int(current_page)

        q = Article.query\
            .filter(Article.feed_id == feed_id)\
            .order_by(desc(Article.published_at))

        num_results = ret['num_results'] = q.count()
        articles = q.paginate(current_page, 40).items

        d = divmod(num_results, 40)
        ret['total_pages'] = d[0] if not d[1] else d[0] + 1

        ret['articles'] = [article.to_dict(with_content=False, with_feed=False) for article in articles]
        
        return jsonify(ret)

api.add_resource(FeedArticlesAPI, '/feed/<int:feed_id>/articles')

@app.route('/feed/test/', methods=['GET', 'POST'])
def test_feed():
    xml_url = request.get_json()['xml_url']

    f = feedparser.parse(xml_url)

    if f.status == 200 or f.status == 301:
        if f.feed.get('title'):
            title = f.feed.get('title')
            subtitle = f.feed.get('subtitle')
            html_url = f.feed.htmlUrl if 'htmlUrl' in f.feed.keys() else None

            if Feed.query.filter_by(title=title, xml_url=xml_url).first():
                msg = "%s already exists in database." % title
                return jsonify(msg=msg, type="danger"), 422

            return jsonify(title=title, subtitle=subtitle, html_url=html_url, xml_url=xml_url)
        else:
            return jsonify({'msg': 'URL could not be parsed as a feed', 'type': 'danger'}), 422

    else:
        return jsonify({'msg': 'URL could not be parsed as a feed', 'type': 'danger'}), 422