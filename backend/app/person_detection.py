import cv2
import numpy as np
from collections import Counter


def detect_objects(image_path, confidence_threshold=0.01):
    """
    Detect objects in an image using YOLOv3, only including objects that are taller than wide

    Args:
        image_path (str): Path to the input image
        confidence_threshold (float): Minimum confidence threshold for detections (0-1)

    Returns:
        tuple: (annotated image, dict of object counts)
    """
    # Load YOLO
    net = cv2.dnn.readNet("models/yolov3.weights", "models/yolov3.cfg")

    # Load classes
    with open("models/coco.names", "r") as f:
        classes = [line.strip() for line in f.readlines()]

    # Read the image
    image = cv2.imread(image_path)
    (h, w) = image.shape[:2]

    # Create a blob and pass it through the network
    blob = cv2.dnn.blobFromImage(image, 1 / 255.0, (416, 416), swapRB=True, crop=False)
    net.setInput(blob)
    layer_names = net.getLayerNames()
    output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]
    outputs = net.forward(output_layers)

    # Initialize lists for detected objects
    boxes = []
    confidences = []
    class_ids = []

    # Loop through detections
    for output in outputs:
        for detection in output:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]

            if confidence > confidence_threshold:
                # Object detected
                center_x = int(detection[0] * w)
                center_y = int(detection[1] * h)
                width = int(detection[2] * w)
                height = int(detection[3] * h)

                # Only include objects that are taller than wide
                if height > width:
                    # Rectangle coordinates
                    x = int(center_x - width / 2)
                    y = int(center_y - height / 2)

                    boxes.append([x, y, width, height])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)

    # Apply Non-Maximum Suppression
    indexes = cv2.dnn.NMSBoxes(boxes, confidences, confidence_threshold, 0.4)

    # Initialize counter for detected objects
    detected_objects = []

    # Draw boxes
    GREEN = (0, 255, 0)  # BGR format in OpenCV
    for i in range(len(boxes)):
        if i in indexes:
            label = str(classes[class_ids[i]])

            # Filter everything except people
            if label.lower() != "person":
                continue

            x, y, width, height = boxes[i]
            detected_objects.append(label)
            cv2.rectangle(image, (x, y), (x + width, y + height), GREEN, 2)
            # Add confidence score to label
            confidence = confidences[i]
            label_with_confidence = f"{label} {confidence:.2f}"
            cv2.putText(
                image,
                label_with_confidence,
                (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                GREEN,
                2,
            )

    # Count objects
    object_counts = dict(Counter(detected_objects))

    return image, object_counts


# Example usage
if __name__ == "__main__":
    # Process image
    image_path = "data/ski_queue6.jpg"
    annotated_image, counts = detect_objects(image_path)

    # Save the result
    cv2.imwrite("detected.jpg", annotated_image)

    # Print counts
    print("\nObject counts:")
    for obj, count in counts.items():
        print(f"{obj}: {count}")