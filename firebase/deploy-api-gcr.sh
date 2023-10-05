GCP_REGION=${REGION:=europe-north1}
GCP_PROJECT=${PROJECT:=dun-imba}

gcloud --project $GCP_PROJECT builds submit --tag eu.gcr.io/$GCP_PROJECT/dun-server -q
gcloud --project $GCP_PROJECT run deploy dun-server --image eu.gcr.io/$GCP_PROJECT/dun-server --platform managed --allow-unauthenticated --region $GCP_REGION -q
