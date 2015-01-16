from flask import Flask, request, jsonify
from flask.ext.restful import Resource, Api
from sqlalchemy import asc
from sqlalchemy import func

from app import api, db
from models import *

def uncategorize_feeds():
    uncategorized_feeds = [f for f in Feed.query.all() if not f.categories]
    uncategorized = Category.uncategorized()

    if uncategorized_feeds:
        [uncategorized.feeds.append(feed) for feed in uncategorized_feeds]

    uncategorized.feeds = [feed for feed in uncategorized.feeds if len(feed.categories) == 1]

class CategoryAPI(Resource):
    def delete(self, category_id):

        category_to_delete = Category.query.get(category_id)
        uncategorized = Category.uncategorized()

        db.session.delete(category_to_delete)
        uncategorize_feeds()
        db.session.commit()

        return jsonify({})

    def put(self, category_id):
        params = request.get_json()
        feed_ids = params.get('feedIds')
        title = params.get('title')


        if Category.query.filter_by(title=title).first():
            msg = "%s already exists in the database."
            return {'msg': msg, 'type': 'danger'}, 422

        feeds_to_add = []
        if feed_ids:
            feeds_to_add = Feed.query.filter(Feed.id.in_(feed_ids)).all()


        category = Category.query.get(category_id)
        category.title = params.get('title')
        category.feeds = feeds_to_add
        uncategorize_feeds()
        db.session.commit()

        return jsonify(category.to_dict())

class CategoriesAPI(Resource):
    def get(self):
        current_page = request.args.get('page') or 1
        current_page = int(current_page)
        
        q = Category.query.order_by(asc(func.lower(Category.title)))

        num_results = q.count()
        categories = q.paginate(current_page, 40).items

        d = divmod(num_results, 40)
        total_pages = d[0] if not d[1] else d[0] + 1

        categories_list = [category.to_dict() for category in categories]
        
        return jsonify(objects=categories_list, total_pages=total_pages, num_results=num_results, page=current_page)

    def post(self):
        params = request.get_json()
        feed_ids = params.get('feedIds')
        title = params.get('title')
        
        if Category.query.filter_by(title=title).first():
            msg = "%s already exists in the database." % title
            return {'msg': msg, 'type': 'danger'}, 422

        feeds_to_add = []
        if feed_ids:
            feeds_to_add = Feed.query.filter(Feed.id.in_(feed_ids)).all()

        category = Category(title=params['title'])
        category.feeds = feeds_to_add
        uncategorize_feeds()
        db.session.commit()

        return jsonify(category.to_dict())


class CategoryArticlesAPI(Resource):
    def get(self, category_id):
        ids = [feed.id for feed in Category.query.get(category_id).feeds]
        columns = Article.__table__.columns.keys()

        current_page = request.args.get('page') or 1
        current_page = int(current_page)

        q = Article.query\
            .filter(Article.feed_id.in_(ids))\
            .order_by(desc(Article.published_at))

        num_results = q.count()
        articles = q.paginate(current_page, 40).items

        d = divmod(num_results, 40)
        total_pages = d[0] if not d[1] else d[0] + 1

        article_list = [article.to_dict(with_content=False) for article in articles]
        
        return jsonify(objects=article_list, total_pages=total_pages, num_results=num_results, page=current_page)

api.add_resource(CategoryAPI, '/category/<int:category_id>')
api.add_resource(CategoriesAPI, '/categories')
api.add_resource(CategoryArticlesAPI, '/category/<int:category_id>/articles')