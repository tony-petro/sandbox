import boto3
from botocore.client import Config
import io
import zipfile
import mimetypes

s3 = boto3.resource('s3')

sandboxBucket = s3.Bucket('sandbox.thewinleague.com')
buildBucket = s3.Bucket('sandbox-build.thewinleague.com')

sandboxZip = io.BytesIO()
buildBucket.download_fileobj('sandboxbuild.zip', sandboxZip)

with zipfile.ZipFile(sandboxZip) as myZip:
    for nm in myZip.namelist():
        obj = myZip.open(nm)
        sandboxBucket.upload_fileobj(obj,nm,
            ExtraArgs={'ContentType': mimetypes.guess_type(nm)[0]})
        sandboxBucket.Object(nm).Acl().put(ACL='public-read')
