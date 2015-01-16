import listparser
from StringIO import StringIO

from app import db
from models import *

class OPMLImporter:
    def __init__(self, opml_data):
        self.opml_data = opml_data
        self.new_feeds = 0
        self.new_categories = 0
        self.failed_feeds = 0

    def get_or_set_feed(self, feed_info):

        feed_title = feed_info.title
        xml_url = feed_info.url

        existing_feed = Feed.query.filter_by(title=feed_title, xml_url=xml_url).first()

        if existing_feed:
            return existing_feed
        else:
            new_feed = Feed(title=feed_title, xml_url=xml_url)
            db.session.add(new_feed)
            self.new_feeds += 1

            return new_feed

    def get_or_set_category(self, category):
        existing_category = Category.query.filter_by(title=category).first()

        if existing_category:
            return existing_category
        else:
            new_category = Category(title=category)
            db.session.add(new_category)
            self.new_categories += 1
            return new_category


    def add_uncategorized_feed(self, feed_info):
        feed = self.get_or_set_feed(feed_info)

    def is_feed_in_category(self, feed_entry, category_entry):
        for feed in category_entry.feeds:
            if feed_entry.title == feed.title and feed_entry.xml_url == feed.xml_url:
                return True

        return False

    def get_return_status(self):
        ret = {'msg': ''}
        if not self.new_feeds and not self.new_categories:
            ret['msg'] = "No new feeds or categories added to database"
            ret['type'] = 'warning'

            return ret

        if self.new_categories:
            ret['msg'] = "%s new categories added." % self.new_categories

        if self.new_feeds:
            ret['msg'] += " %s new feeds added." % self.new_feeds

        if self.failed_feeds:
            ret['msg'] += " Could not add %s feeds." % self.failed_feeds
            ret['type'] = 'warning'
        else:
            ret['type'] = 'success'

        ret['msg'].strip()
        return ret


    def run(self):
        f = StringIO(self.opml_data.encode('utf-8'))

        opml_obj = listparser.parse(f)

        for feed in opml_obj.feeds:
            if not feed.tags:
               self.add_uncategorized_feed(feed) 

            for category in feed.tags:
                category_entry = self.get_or_set_category(category)         

                try:
                    feed_entry = self.get_or_set_feed(feed)
                except:
                    self.failed_feeds += 0
                    continue

                if self.is_feed_in_category(feed_entry, category_entry):
                    continue

                category_entry.feeds.append(feed_entry)
        
        Feed.uncategorize_feeds()
        db.session.commit()

        ret = self.get_return_status()
        return ret
        
 


