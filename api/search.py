from flask import jsonify, request
from app import app
from models import *
from datetime import datetime

@app.route('/search', methods=['POST'])
def search():
    q = Article.query.order_by(desc(Article.published_at))
    columns = Article.__table__.columns.keys()
    current_page = request.args.get('page') or 1
    current_page = int(current_page)

    params = request.get_json()
    if not params:
        articles = q.paginate(current_page, 40).items
        num_results = q.count()
        article_list = [article.to_dict(with_content=False) for article in articles]
        d = divmod(num_results, 40)
        total_pages = d[0] if not d[1] else d[0] + 1
        return jsonify(objects=article_list, total_pages=total_pages, num_results=num_results, page=current_page)

    if params.get('keywords'):    
        keywords = params['keywords'].split(" ")
        for keyword in keywords:
            q = q.filter(Article.title.like("% " + keyword + " %") | Article.content.like("% " + keyword + " %"))

    category_ids = params.get('category_ids', [])
    feed_ids = params.get('feed_ids', [])
    start_date = params.get('start_date')
    end_date = params.get('end_date')
    category_feed_ids = []

    if category_ids:
        categories = Category.query.filter(Category.id.in_(category_ids)).all()
        category_feed_ids = [feed.id for feed in itertools.chain.from_iterable([c.feeds for c in categories])]

    all_feed_ids = set(category_feed_ids + feed_ids)

    if all_feed_ids:
        q = q.filter(Article.feed_id.in_(all_feed_ids))

    if start_date:
        d = datetime.fromtimestamp(start_date / 1e3)
        q = q.filter(Article.published_at > d)

    if end_date:
        d = datetime.fromtimestamp(end_date / 1e3)
        q = q.filter(Article.published_at < d)

    articles = q.paginate(current_page, 40).items
    num_results = q.count()

    d = divmod(num_results, 40)
    total_pages = d[0] if not d[1] else d[0] + 1

    article_list = [article.to_dict(with_content=False) for article in articles]

    return jsonify(objects=article_list, total_pages=total_pages, num_results=num_results, page=current_page)