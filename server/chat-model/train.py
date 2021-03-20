import json
from nltk_utils import tokenize, stem, bag_of_words
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from model import NeuralNet

class ChatDataset(Dataset):
    def __init__(self):
        self.n_samples = len(X_train)
        self.x_data = X_train
        self.y_data = Y_train


    def __getitem__(self, idx):
        return self.x_data[idx], self.y_data[idx]

    def __len__(self):
        return self.n_samples

if __name__ == '__main__':
    with open('intents.json', 'r') as f:
        intents = json.load(f)

    all_words = []
    tags = []
    xy = []

    for intent in intents['intents']:
        tag = intent['tag']
        tags.append(tag)

        for pattern in intent['patterns']:
            w = tokenize(pattern)
            all_words.extend(w)
            xy.append((w, tag))


    ignore_words = ["?", "!", ".", ","]

    all_words = [stem(w) for w in all_words if w not in ignore_words]
    all_words = sorted(set(all_words))
    tags = sorted(set(tags))


    X_train = []
    Y_train = []

    for (pattern_sentence, tag) in xy:
        bag = bag_of_words(pattern_sentence, all_words)
        X_train.append(bag)

        label = tags.index(tag)
        Y_train.append(label)


    X_train = np.array(X_train)
    Y_train = np.array(Y_train)

    batch_size = 8
    hidden_size = 8
    output_size = len(tags)
    input_size = len(X_train[0])
    learning_rate = 0.001
    num_epochs = 1000

    dataset = ChatDataset()
    train_loader = DataLoader(dataset=dataset, batch_size=batch_size, shuffle=True, num_workers=2)

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    print("Using device: ", device)

    model = NeuralNet(input_size, hidden_size, output_size).to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), learning_rate)

    print("Starting training")
    for epoch in range(num_epochs):
        for (words, labels) in train_loader:
            words = words.to(device)
            labels = labels.to(dtype=torch.long).to(device)

            outputs = model(words)
            loss = criterion(outputs, labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

        if (epoch+1) % 100 == 0:
            print('Epoch ' + str(epoch+1/num_epochs) + "Loss: " + str(loss.item()))


    print("Final loss, loss=" + str(loss.item()))

    data = {
    "model_state": model.state_dict(),
    "input_size": input_size,
    "hidden_size": hidden_size,
    "output_size": output_size,
    "all_words": all_words,
    "tags": tags
    }

    FILE = "data.pth"
    torch.save(data, FILE)

    print(f'training complete. file saved to {FILE}')
