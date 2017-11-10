import boto3
from botocore.client import Config
import io
import zipfile
import mimetypes

def lambda_handler(event, context):
    sns = boto3.resource('sns')
    topic = sns.Topic('arn:aws:sns:us-east-1:885622517920:deploySandboxTopic')

    try:
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

        print ("Build job done")
        topic.publish(Subject="Successful deployment", Message="Sandbox build deployed succesfully")
    except:
        topic.publish(Subject="Failed deployment", Message="Sandbox build failed")
        raise
