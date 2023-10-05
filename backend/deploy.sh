GCP_REGION=${REGION:=europe-north1}
GCP_PROJECT=${PROJECT:=dun-imba}

gcloud builds submit --tag gcr.io/$GCP_PROJECT/dun-server -q
gcloud --project $GCP_PROJECT run deploy dun-server --image gcr.io/$GCP_PROJECT/dun-server --platform managed --allow-unauthenticated --region $GCP_REGION -q