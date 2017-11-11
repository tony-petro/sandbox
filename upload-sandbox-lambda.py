import boto3
from botocore.client import Config
import io
import zipfile
import mimetypes

def lambda_handler(event, context):
    sns = boto3.resource('sns')
    topic = sns.Topic('arn:aws:sns:us-east-1:885622517920:deploySandboxTopic')

    location = {
        "bucketName": 'sandbox-build.thewinleague.com',
        "objectKey": 'sandboxbuild.zip'
    }

    try:
        job=event.get("CodePipeline.job")

        if job:
            for artifact in job["data"]["inputArtifacts"]:
                if artifact["name"] == "MyAppBuild":
                    location =  artifact["location"]["s3Location"]

        print ("Building sandbox from " + str(location)

        s3 = boto3.resource('s3')

        sandboxBucket = s3.Bucket('sandbox.thewinleague.com')
        buildBucket = s3.Bucket(location["bucketName"])

        sandboxZip = io.BytesIO()
        buildBucket.download_fileobj(location["objectKey"], sandboxZip)

        with zipfile.ZipFile(sandboxZip) as myZip:
            for nm in myZip.namelist():
                obj = myZip.open(nm)
                sandboxBucket.upload_fileobj(obj,nm,
                    ExtraArgs={'ContentType': mimetypes.guess_type(nm)[0]})
                sandboxBucket.Object(nm).Acl().put(ACL='public-read')

        print ("Build job done")
        topic.publish(Subject="Successful deployment", Message="Sandbox build deployed succesfully")
        if job:
            codepipeline = boto3.client("codepipeline")
            codepipeline.put_job_success_result(jobId=job["id"])

    except:
        topic.publish(Subject="Failed deployment", Message="Sandbox build failed")
        raise
