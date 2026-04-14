"""
Generate dataset.csv and carbon_model.pkl
Run this script once before starting the Flask app
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import pickle

print("="*60)
print("🌍 Carbon Footprint Predictor - Data & Model Generator")
print("="*60)

# Generate dataset
print("\n📊 Generating dataset.csv...")

np.random.seed(42)
n_samples = 300

distance = np.random.uniform(5, 100, n_samples)
electricity = np.random.uniform(100, 1000, n_samples)
flights = np.random.randint(0, 20, n_samples)
transport_type = np.random.randint(0, 4, n_samples)
diet_type = np.random.randint(0, 2, n_samples)

transport_emissions = []
for i in range(n_samples):
    if transport_type[i] == 0:
        transport_emissions.append(0)
    elif transport_type[i] == 1:
        transport_emissions.append(distance[i] * 0.01)
    elif transport_type[i] == 2:
        transport_emissions.append(distance[i] * 0.05)
    else:
        transport_emissions.append(distance[i] * 0.2)

transport_emissions = np.array(transport_emissions) * 30
electricity_emissions = electricity * 0.82
flight_emissions = flights * 250 / 12
diet_emissions = np.where(diet_type == 1, 200, 100)

carbon_footprint = (
    transport_emissions + 
    electricity_emissions + 
    flight_emissions +
    diet_emissions +
    np.random.normal(0, 20, n_samples)
)

df = pd.DataFrame({
    'distance': distance,
    'transport_type': transport_type,
    'electricity': electricity,
    'flights': flights,
    'diet_type': diet_type,
    'carbon_footprint': carbon_footprint
})

df.to_csv('dataset.csv', index=False)
print(f"✅ dataset.csv created with {n_samples} samples")

# Train model
print("\n🤖 Training Linear Regression model...")

X = df[['distance', 'transport_type', 'electricity', 'flights', 'diet_type']]
y = df['carbon_footprint']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)
rmse = np.sqrt(mse)

print(f"\n📈 Model Performance:")
print(f"   R² Score: {r2:.4f}")
print(f"   RMSE: {rmse:.2f} kg CO₂")

with open('carbon_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print(f"\n✅ carbon_model.pkl saved successfully")
print("\n" + "="*60)
print("✅ ALL FILES GENERATED SUCCESSFULLY!")
print("="*60)
print("\n🚀 You can now run: python app.py")