#!/bin/bash

set -euo pipefail

# # enable api https://console.developers.google.com/apis/api/appengine.googleapis.com/overview
# # disable billing
# nvm install 16.4.0
# gcloud app create --project "$GOOGLE_CLOUD_PROJECT" --region us-east1
# gcloud iam service-accounts create deployer-github
# gcloud projects add-iam-policy-binding "$GOOGLE_CLOUD_PROJECT" --member="serviceAccount:deployer-github@$GOOGLE_CLOUD_PROJECT.iam.gserviceaccount.com" --role="roles/appengine.deployer"
# gcloud projects add-iam-policy-binding "$GOOGLE_CLOUD_PROJECT" --member="serviceAccount:deployer-github@$GOOGLE_CLOUD_PROJECT.iam.gserviceaccount.com" --role="roles/iam.serviceAccountUser"
# gcloud projects add-iam-policy-binding "$GOOGLE_CLOUD_PROJECT" --member="serviceAccount:deployer-github@$GOOGLE_CLOUD_PROJECT.iam.gserviceaccount.com" --role="roles/cloudbuild.builds.editor"
# gcloud projects add-iam-policy-binding "$GOOGLE_CLOUD_PROJECT" --member="serviceAccount:deployer-github@$GOOGLE_CLOUD_PROJECT.iam.gserviceaccount.com" --role="roles/storage.objectAdmin"
# gcloud iam service-accounts keys create gac.json --iam-account "deployer-github@$GOOGLE_CLOUD_PROJECT.iam.gserviceaccount.com"
# cat gac.json

cd app
export GOOGLE_APPLICATION_CREDENTIALS="gac.json"
echo "$1" > "$GOOGLE_APPLICATION_CREDENTIALS"
npm install google-auth-library
gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"
echo "runtime: nodejs16" > app.yaml
project_id="$(cat $GOOGLE_APPLICATION_CREDENTIALS | jq -r .project_id)"
gcloud app deploy --project "${project_id}"
