import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '.env/lib/python2.7/site-packages'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from twisted.internet import defer, reactor
from twisted.web.client import getPage
from twisted.internet import task

from models import Category, Feed, Article

import feedparser

from datetime import datetime
from time import mktime

current_dir = os.path.dirname(os.path.realpath(__file__))
engine = create_engine('sqlite:///' + os.path.join(current_dir, 'rss.db'))
Session = sessionmaker(bind=engine)
Session.configure(bind=engine)
session = Session()

class AsyncClient:
    def __init__(self):
        
        self.updated_feeds = 0
        self.new_articles = 0
        
        feeds = session.query(Feed).all()
        self.feed_data = {feed.xml_url: {'feed': feed} for feed in feeds}
        self.total_feeds = len(feeds)
        session.autoflush = False

     
    def process_feeds(self):
        print 'Processing feeds...'
        for url, entry in self.feed_data.iteritems():
            if not entry.get('parsed'):
                continue    
            self.process_articles(entry['parsed'], entry['feed'])
            self.updated_feeds += 1

        
        print "%s: Updated %s of %s feeds, %s new articles.\n" % (str(datetime.now()), self.updated_feeds, self.total_feeds, self.new_articles)

        try:
            session.commit()
        except Exception, e:
            session.rollback()
        
        session.close()

    def process_articles(self, parsed, feed):
        #print parsed
        for entry in parsed.entries:
            href = ''
            if 'links' in entry:
                href = entry.links[-1].get('href')
            elif 'href' in entry:
                print 'href in entry'
                href = entry.href
            
            if entry.get('published_parsed'):
                published_at = datetime.fromtimestamp(mktime(entry.published_parsed))
            elif entry.get('updated_parsed'):
                published_at = datetime.fromtimestamp(mktime(entry.updated_parsed))
            else:
                published_at = datetime.now()

            if session.query(Article).filter_by(title=entry.title, href=href).first():
                continue
            
            new_article = Article(title=entry.title, content=entry.summary, href=href, published_at=published_at)
            feed.articles.append(new_article)
            self.new_articles += 1

    def pageCallback(self, result, url):
        data = {
            'content': result,
            'url': url,
        }

        return data
     
    def pageErrback(self, error, url):
        return {
            'msg': error.getErrorMessage(),
            'err': error,
            'url': url,
         }
     
    def getPageData(self, url):
        d = getPage(url.encode('utf-8'), timeout=10)
        d.addCallback(self.pageCallback, url)
        d.addErrback(self.pageErrback, url)
        return d
     
    def listCallback(self, result):
        for ignore, data in result:
            if data.has_key('err'):
                continue
            else:
                self.feed_data[data['url']]['parsed'] = feedparser.parse(data['content'])

        self.process_feeds()
     
    def finish(self, ign):
        reactor.stop()
     
    def run(self):
        deferreds = []
        for url in self.feed_data.keys():
            d = self.getPageData(url)
            deferreds.append(d)
      
        dl = defer.DeferredList(deferreds, consumeErrors=1)
        dl.addCallback(self.listCallback)



def run():
    print "%s: Refreshing feeds...\n" % str(datetime.now())
    async_client = AsyncClient()
    async_client.run()

def setup_task():
    l = task.LoopingCall(run)
    l.start(120)
    reactor.run(installSignalHandlers=0)

if __name__ == "__main__":
    setup_task()
