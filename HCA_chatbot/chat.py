from flask import Flask, render_template, request, jsonify, session

import ollama

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Necessary for session management

@app.route('/')
def home():
    session.clear()  # Clear the session on every visit to the home page
    return render_template('index.html')

@app.route('/get_response', methods=['POST'])
def get_response():
    user_query = request.form['query']
    
    # Initialize conversation history in the session if it doesn't exist
    if 'conversation_history' not in session:
        session['conversation_history'] = []

    # Check for exit command
    if "bye" in user_query.lower():
        session.clear()  # Clear the session
        return jsonify(response="Goodbye! Take care!")

    # Check for expressions of gratitude
    if "thank you" in user_query.lower() or "thanks" in user_query.lower():
        return jsonify(response="You're welcome! If you have any more questions, feel free to ask.")

    # Add the user's query to the conversation history
    session['conversation_history'].append(f"User: {user_query}")

    # Create a context from the conversation history
    context = "\n".join(session['conversation_history'])
    prompt = f"Based on the following conversation, respond to the user's latest healthcare query with a broader perspective while still being cautious. Include general information without giving specific medical advice:\n\n{context}\n\nProvide a clear and informative response without any introductory phrases."

    # Use Ollama's `gemma:2b` model to generate a response
    response = ollama.generate(
        model="gemma:2b",
        prompt=prompt
    )

    # Extract the answer from the `response` key
    answer = response.get('response', "No response available.").strip()

    # Add the bot's response to the conversation history
    session['conversation_history'].append(f"Bot: {answer}")

    return jsonify(response=answer)

if __name__ == '__main__':
    app.run(debug=True)
