import os
import json
import time
import requests
import boto3

def call_comfyui(prompt_data):
    """ComfyUIのAPIを同期処理で呼び出す"""
    base_url = "http://localhost:8188"
    headers = {"Content-Type": "application/json"}
    
    # 1. プロンプト実行
    start_res = requests.post(
        f"{base_url}/prompt",
        headers=headers,
        json={"prompt": prompt_data},
        timeout=300
    )
    start_res.raise_for_status()
    prompt_id = start_res.json()["prompt_id"]
    print(f"Started generation: {prompt_id}")
    
    # 2. 完了待機
    while True:
        queue_res = requests.get(f"{base_url}/queue", timeout=30)
        queue_data = queue_res.json()
        
        # キューから消えたか確認
        running_ids = [item[1] for item in queue_data["queue_running"]]
        pending_ids = [item[1] for item in queue_data["queue_pending"]]
        
        if prompt_id not in running_ids + pending_ids:
            break
        
        time.sleep(1)  # 負荷軽減のため1秒間隔
    
    print(f"Completed: {prompt_id}")
    return {"prompt_id": prompt_id}

def process_message(msg):
    try:
        payload = json.loads(msg['Body'])
        print(f"Processing: {msg['MessageId']}")
        
        result = call_comfyui(payload)
        print(f"Result: {result}")
        
    except Exception as e:
        print(f"Error: {str(e)}")

def main():
    sqs = boto3.client('sqs')
    queue_url = os.getenv('SQS_QUEUE_URL')
    
    while True:
        try:
            resp = sqs.receive_message(
                QueueUrl=queue_url,
                MaxNumberOfMessages=1,
                WaitTimeSeconds=20
            )
            
            if 'Messages' in resp:
                process_message(resp['Messages'][0])
                
        except Exception as e:
            print(f"System error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()