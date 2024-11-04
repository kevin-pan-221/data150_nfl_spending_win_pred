from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib

class winNN(nn.Module):
    def __init__(self, input_size):
        super(winNN, self).__init__()
        self.fc = nn.Sequential(
            nn.Linear(input_size, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1)
        )

    def forward(self, x):
        return self.fc(x)
    
path = 'model/nfl_wins_spending_nn_simple.pth'
model = torch.load(path)  
model.eval()
scaler = joblib.load('model/nfl_win_scaler.pkl')

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    input_data = np.array(data['features']).reshape(1, -1)
    input_data_scaled = scaler.transform(input_data)
    input_tensor = torch.FloatTensor(input_data_scaled)
    
    with torch.no_grad():
        prediction = model(input_tensor).item()
    
    return jsonify({'predicted_wins': prediction})

if __name__ == '__main__':
    app.run(debug=True)
