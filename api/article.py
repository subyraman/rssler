from flask import Flask, request, jsonify
from flask.ext.restful import Resource, Api

from app import api
from models import *


class ArticleAPI(Resource):
    def get(self, article_id):
        article = Article.query.get(article_id)
        return jsonify(article.to_dict(with_content=True))


api.add_resource(ArticleAPI, '/article/<int:article_id>')

class ArticlesAPI(Resource):
    def get(self):
        current_page = request.args.get('page') or 1
        current_page = int(current_page)

        q = Article.query.order_by(desc(Article.published_at))
        articles = q.paginate(current_page, 40).items
        num_results = q.count()
        
        d = divmod(num_results, 40)
        total_pages = d[0] if not d[1] else d[0] + 1
        
        article_list = [article.to_dict() for article in articles]

        return jsonify(objects=article_list, total_pages=total_pages, num_results=num_results, page=current_page)


api.add_resource(ArticlesAPI, '/articles')