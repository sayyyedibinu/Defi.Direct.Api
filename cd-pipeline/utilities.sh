function getScrubbedBranchName()
{   
    branchNameScrubbed=$(echo "$BRANCH_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[_,.]/-/g')
    echo "$branchNameScrubbed"
}

# Hacky fix for https://github.com/kubernetes/kubernetes/issues/40224
function retryableWaitForDeployment(){
	local ROLLOUT_STATUS=1
	local INTERVAL=0
	
	while [[ $ROLLOUT_STATUS -eq 1 && $INTERVAL -le 5 ]]
	do
	 ROLLOUT_MESSAGE=$(kubectl rollout status deploy/$1 --namespace=$2)
	 ROLLOUT_STATUS=$?
	 INTERVAL=$((INTERVAL + 1))
	done
	echo "Checked rollout status for $1 $INTERVAL time(s)..."
	echo $ROLLOUT_MESSAGE
	if [[ $ROLLOUT_STATUS != 0 ]]; then exit $ROLLOUT_STATUS; fi
}

# $1 Environment
# $2 Piece of info needed
function getK8sInfo()
{
	ssmEnvParam="$1"
	ssmEnv=${ssmEnvParam^^}  # Make it uppercase
	ssmCategory="nonprod"

	if [[ "$ssmEnv" == "PROD" ]] ; then
		# Only get the prod item if this is prod branch; otherwise permissions will fail
		branchName=$(getScrubbedBranchName)
		if [[ "$ssmEnv" == "PROD" ]] && [[ "$branchName" != "prod" ]] ; then
    		echo ""
			exit
		else
			ssmCategory="prod"
		fi
	fi
	
	paramRequested="$2"

	if [[ "$paramRequested" == "token" ]] ; then
		if [[ "$ssmCategory" != "prod" ]] ; then
			paramJson=$(aws --region $AWS_REGION ssm get-parameter --name "/los/defi-apps-nonprod/EKS/token" --with-decryption)
		else
			paramJson=$(aws --region $AWS_REGION ssm get-parameter --name "/los/defi-apps-prod/EKS/token" --with-decryption)
		fi
  	elif [[ "$paramRequested" == "endpoint" ]] ; then
	  	if [[ "$ssmCategory" != "prod" ]] ; then
			paramJson=$(aws --region $AWS_REGION ssm get-parameter --name "/los/defi-apps-nonprod/EKS/api_server_endpoint")
		else
			paramJson=$(aws --region $AWS_REGION ssm get-parameter --name "/los/defi-apps-prod/EKS/api_server_endpoint")
		fi
	elif [[ "$paramRequested" == "primaryIngressHost" ]] ; then
		if [[ "$ssmCategory" != "prod" ]] ; then
			paramJson=$(aws --region $AWS_REGION ssm get-parameter --name "/los/defi-apps-nonprod/EKS/primary_ingress_host")
		else
			paramJson=$(aws --region $AWS_REGION ssm get-parameter --name "/los/defi-apps-prod/EKS/primary_ingress_host")
		fi
	elif [[ "$paramRequested" == "secondaryIngressHost" ]] ; then
		if [[ "$ssmCategory" != "prod" ]] ; then
			paramJson=$(aws --region $AWS_REGION ssm get-parameter --name "/los/defi-apps-nonprod/EKS/secondary_ingress_host")
		else
			paramJson=$(aws --region $AWS_REGION ssm get-parameter --name "/los/defi-apps-prod/EKS/secondary_ingress_host")
		fi
	elif [[ "$paramRequested" == "nonprod01-token" ]] ; then
		paramJson=$(aws --region $AWS_REGION ssm get-parameter --name "/los/defi-apps-nonprod/EKS/nonprod01-cont01/token" --with-decryption)
	elif [[ "$paramRequested" == "nonprod01-endpoint" ]] ; then
		paramJson=$(aws --region $AWS_REGION ssm get-parameter --name "/los/defi-apps-nonprod/EKS/nonprod01-cont01/api_server_endpoint")
	elif [[ "$paramRequested" == "nonprod01-secondaryIngressHost" ]] ; then
		echo "services01.nonprod.defiapps.com"
		exit
	elif [[ "$paramRequested" == "nonprod02-token" ]] ; then
		paramJson=$(aws --region $AWS_REGION ssm get-parameter --name "/los/defi-apps-nonprod/EKS/nonprod02-cont01/token" --with-decryption)
	elif [[ "$paramRequested" == "nonprod02-endpoint" ]] ; then
		paramJson=$(aws --region $AWS_REGION ssm get-parameter --name "/los/defi-apps-nonprod/EKS/nonprod02-cont01/api_server_endpoint")
	elif [[ "$paramRequested" == "nonprod02-secondaryIngressHost" ]] ; then
		echo "services02.nonprod.defiapps.com"
		exit
	else
		echo "Don't know how to get that item"
		exit 1
	fi

	return_code=$?
	if [[ $return_code -ne 0 ]] ; then 
		echo "Failed to get value from Parameter Store; exit code $return_code"
		exit $return_code;
	fi

	paramValue=$(echo $paramJson | python3 -c 'import json,sys;obj=json.load(sys.stdin);print(obj["Parameter"]["Value"])')
	return_code=$?
	if [[ $return_code -ne 0 ]] ; then 
		echo "Failed to parse value from Parameter Store JSON; exit code $return_code"
		exit $return_code;
	fi

  	echo "$paramValue"
}