import pandas as pd
from sklearn.linear_model import SGDRegressor
import xxhash
import warnings
import time

# Suppress the specific warning
warnings.filterwarnings("ignore", category=UserWarning)

class SVGModel:
    def __init__(self, dataset_path):
        self.reverse_mapping = {}
        self.data = pd.read_csv(dataset_path)
        self.sgd_model = SGDRegressor(random_state=42)
        self.pre_processing()
    # Hash from uuid -> int
    def hash_string(self, input_string):
        hasher = xxhash.xxh32()
        hasher.update(input_string.encode())
        hashed_value = hasher.intdigest()
        if hashed_value not in self.reverse_mapping:
            self.reverse_mapping[hashed_value] = input_string
        return hashed_value
    # Reverse hash from int -> uuid
    def get_hash_original(self, hash):
        return self.reverse_mapping.get(hash)
    # Pre-processing data
    def pre_processing(self):
        self.data['userId'] = self.data['userId'].apply(self.hash_string)
        self.data['productId'] = self.data['productId'].apply(self.hash_string)
    # Train the initial model using your initial dataset:
    def train_model(self):
        X_initial = self.data[['userId', 'productId']]
        y_initial = self.data['rating']

        self.sgd_model.partial_fit(X_initial, y_initial)
    # Update the model incrementally with new data
    def update_model(self, newdata_path):
        # Read new data
        new_data = pd.read_csv(newdata_path)
        new_data['userId'] = new_data['userId'].apply(self.hash_string)
        new_data['productId'] = new_data['productId'].apply(self.hash_string)
        # Start the timer
        start_time = time.time()
        X_new = new_data[['userId', 'productId']]
        y_new = new_data['rating']
        
        self.data = pd.concat([self.data, new_data], ignore_index=True)

        self.sgd_model.partial_fit(X_new, y_new)

        # Stop the timer
        end_time = time.time()
        # Print the execution time
        print("Execution Time:", end_time - start_time, "seconds")
    # Recommend product for user
    def get_recommendations(self, user_id):
        # You may need to filter recommendations based on a threshold rating
        # For example, recommending products with a rating above 3.5
        user_rated_products = self.data[self.data['userId'] == user_id]['productId']
        recommended_products = []
        for product_id in self.data['productId'].unique():
            # Check if the user has not rated the product
            if product_id not in user_rated_products:
                rating = self.sgd_model.predict([[user_id, product_id]])
                rating = rating / pow(10, 28)
                # print(self.get_hash_original(product_id) + ':' + str(rating / pow(10, 28)))
                if rating > 3.5:
                    if len(recommended_products) < 5:
                        recommended_products.append(self.get_hash_original(product_id))

        return recommended_products
    def calculate_precision(self, user_id, threshold=3.5):
        user_rated_products = self.data[self.data['userId'] == user_id]
        predicted_ratings = []

        for product_id in user_rated_products['productId']:
            # Check if the user has not rated the product
            if product_id not in user_rated_products:
                rating = self.sgd_model.predict([[user_id, product_id]])[0]
                # print(self.get_hash_original(product_id) + ':' + str(rating / pow(10, 28)))
                rating = rating / pow(10, 28)
                predicted_ratings.append(rating)

        # Calculate precision
        true_positives = sum(1 for rating in predicted_ratings if rating > threshold)
        total_positive_recommendations = len(predicted_ratings)

        if total_positive_recommendations > 0:
            precision = true_positives / total_positive_recommendations
        else:
            precision = 0.0

        return precision
    # Calculate system-level precision
    def calculate_system_precision(self, threshold=3.5):
        user_ids = self.data['userId'].unique()
        precision_values = []

        for user_id in user_ids:
            precision = self.calculate_precision(user_id, threshold)
            precision_values.append(precision)

        # Calculate the average precision across all users
        system_precision = sum(precision_values) / len(precision_values)
        print(sum(precision_values), len(precision_values))
        return system_precision

svgModel = SVGModel("test.csv")
svgModel.train_model()
user_id = 'user1'
svgModel.get_recommendations(svgModel.hash_string(user_id))
svgModel.update_model("newdata.csv")
svgModel.get_recommendations(svgModel.hash_string(user_id))
model_precision = svgModel.calculate_system_precision()
print('Precision of SVGModel: ', model_precision * 100, '%')