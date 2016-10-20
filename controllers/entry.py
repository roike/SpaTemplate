#!/usr/bin/env python
# -*- coding: utf-8 -*-
# spaTemplate controller.entry.py
# See License
# -------------------------------------------
#APIモジュール---------------------------------
from google.appengine.api import users, images
import logging, cloudstorage as gcs
#localモジュール-----------------------------


#gcs---------------------------------------------
BUCKET_IMAGES = 'staging.elabo-two.appspot.com'

#画像投稿--------------------------------------
#GCSにファイル保存し画像の提供urlを投稿元に戻す
class Upload(object):

    def write_gcs(self, upload):

        filename = upload.filename
        #logging.info(filename)
        gcs_filename = '/%s/%s' % (BUCKET_IMAGES, filename)
        blob = upload.file.getvalue()
        with gcs.open(gcs_filename, 'w', content_type=b'binary/octet-stream', options={b'x-goog-acl': b'private'}) as f:
            f.write(blob)

        return filename
        

    def read_gcs(self, filename):
        img_format = filename.split('.')[-1]
        gcs_filename = '/%s/%s' % (BUCKET_IMAGES, filename)
        try:
            #GCSのファイルチェックのみ使用--なければgcs.NotFoundError
            stat = gcs.stat(gcs_filename)
            #------------------------------------------------------
            with gcs.open(gcs_filename) as f:
                img = images.Image(f.read())
            img.resize(width=500, height=250)
            img.im_feeling_lucky()

            if img_format == 'jpg':
                return img.execute_transforms(output_encoding=images.JPEG)
            elif img_format == 'png':
                return img.execute_transforms(output_encoding=images.PNG)

        except gcs.NotFoundError:
            logging.error(u'%s was not Found in gcs.' % filename)

        except Exception as e:
            logging.error(u'Blob read failed for %s, exception: %s. ' % (filename, str(e)))



#wrapper---------------------------
def make_app_wrapper(cls, func):
    def wrapper(params):
        #logging.info(params)
        return getattr(cls(), func)(params)
    return wrapper

write_gcs = make_app_wrapper(Upload, 'write_gcs')
read_gcs = make_app_wrapper(Upload, 'read_gcs')

