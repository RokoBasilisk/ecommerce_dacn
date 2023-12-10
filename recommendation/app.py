import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import LabelEncoder

# Step 1: Data preparation (Historical Data)
historical_data = pd.DataFrame({
    'customerId': ['user1', 'user2', 'user1', 'user3'],
    'productId': ['product1', 'product2', 'product3', 'product2'],
    'rating': [4, 5, 3, 4]
})

# Step 2: Feature enginerring (optional)

# Step 3: Model Training
# Encode customer and product ID to numeric values

productLabel = LabelEncoder()
customerLabel = LabelEncoder()
historical_data['productId'] = productLabel.fit_transform(historical_data['productId'])
historical_data['customerId'] = customerLabel.fit_transform(historical_data['customerId'])

x = historical_data[['customerId', 'productId']]
y = historical_data['rating']

knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(x.values, y.values)

# Step 4: Make prediction (Recommendation for a user)
user_id = 'user1'
product_id = 'product2'
print(productLabel.transform([product_id]))
print(customerLabel.transform([user_id]))
user_encoded = [customerLabel.transform([user_id]), productLabel.transform([product_id])]

# Find the k-nearest neighbors (k=3) of the user
distances, neighbor_indices = knn.kneighbors([user_encoded], n_neighbors=3)

# Extract product ID of the neighbors
neighbor_products = historical_data['productId'][neighbor_indices[0]]

# Filter out products already rated by the user
user_rated_products = historical_data[historical_data['customerId'] == user_encoded['productId']]
recommend_products = neighbor_products[~neighbor_products.isin(user_rated_products)]

print("Recommended products:")
for product_id in recommend_products:
        print(productLabel.inverse_transform(product_id)[0])
