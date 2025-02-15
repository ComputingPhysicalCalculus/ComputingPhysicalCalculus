import matplotlib.pyplot as plt
import sys

# Read data from file
x = []
y1 = []
y2 = []

# Assuming the file is called 'data.txt' and has the format: x_i, y1_i, y2_i
with open(f'data{sys.argv[1] if len(sys.argv) == 2 else ''}.txt', 'r') as file:
    print(f'data{sys.argv[1] if len(sys.argv) == 2 else ''}.txt')
    for line in file:
        values = line.strip().split(',')
        x.append(float(values[0]))  # x_i
        y1.append(float(values[1]))  # y1_i
        y2.append(float(values[2]))  # y2_i

# Create a plot
plt.plot(x, y1, label='y1', color='b')
plt.plot(x, y2, label='y2', color='r')

# Add labels and title
plt.xlabel('x')
plt.ylabel('y')
plt.title('Plot of y1 and y2 against x')

# Add a legend
plt.legend()

# Show the plot
plt.show()
