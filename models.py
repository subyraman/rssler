from app import db
from app import app
import time
import itertools

from sqlalchemy import desc
from sqlalchemy.ext.hybrid import hybrid_property, hybrid_method
from sqlalchemy.orm import deferred

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    body = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    def __init__(self, title, body):
        self.title = title
        self.body = body

category_feeds = db.Table('category_feeds',
    db.Column('feed_id', db.Integer, db.ForeignKey('feed.id')),
    db.Column('category_id', db.Integer, db.ForeignKey('category.id'))
)

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    content = deferred(db.Column(db.Text))
    href = db.Column(db.Text)
    feed_id = db.Column(db.Integer, db.ForeignKey('feed.id'))
    published_at = db.Column(db.DateTime)

    def __init__(self, **kwargs):
        for key, value in kwargs.iteritems():
            setattr(self, key, value)

    @hybrid_method
    def to_dict(self, with_content=False):
        d = self.__dict__

        if self.feed:
            d['feed'] = {'title': self.feed.title, 'id': self.feed.id}
        d.pop('feed_id')

        if with_content:
            d['content'] = self.content

        d.pop('_sa_instance_state')

        return d

class Feed(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    xml_url = db.Column(db.Text)
    html_url = db.Column(db.Text)
    articles = db.relationship('Article', backref='feed', cascade="all,delete")

    def __init__(self, **kwargs):
        for key, value in kwargs.iteritems():
            setattr(self, key, value)

    @hybrid_method
    def to_dict(self, with_articles=True, with_categories=True):
        d = self.__dict__
        articles = [{'id': article.id, 'published_at': article.published_at, 'title': article.title} for article in self.articles]

        if with_articles:
            d['articles'] = sorted(articles, key=lambda x: x['published_at'], reverse=True)
        else:
            d.pop('articles')

        if with_categories:
            d['categories'] = [{'id': category.id, 'title': category.title} for category in self.categories]

        d.pop('_sa_instance_state')

        return d

    @hybrid_method
    def uncategorize_feeds(self):
        uncategorized_feeds = [f for f in Feed.query.all() if not f.categories]
        uncategorized = Category.uncategorized()

        if uncategorized_feeds:
            [uncategorized.feeds.append(feed) for feed in uncategorized_feeds]

        uncategorized.feeds = [feed for feed in uncategorized.feeds if len(feed.categories) == 1]


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    feeds = db.relationship('Feed', secondary=category_feeds,
        backref=db.backref('categories'))

    @hybrid_method
    def uncategorized(self):
        uncategorized = db.session.query(Category).filter_by(title="Uncategorized").first()

        if not uncategorized:
            uncategorized = Category(title="Uncategorized")
            db.session.add(uncategorized)
            db.session.commit()

        return uncategorized

    @hybrid_method
    def to_dict(self):
        d = self.__dict__
        d['feeds'] = [{'id': feed.id, 'title': feed.title} for feed in self.feeds]
        d.pop('_sa_instance_state')

        return d

    def __init__(self, **kwargs):
        for key, value in kwargs.iteritems():
           setattr(self, key, value)


class LastUpdated(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    last_updated = db.Column(db.DateTime)

    def __init__(self, **kwargs):
        for key, value in kwargs.iteritems():
           setattr(self, key, value)
