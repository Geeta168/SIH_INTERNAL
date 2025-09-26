import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from PIL import Image
import numpy as np
import io

MONGODB_URL = os.getenv('MONGODB_URL', 'mongodb://127.0.0.1:27017/sih_internal')
CLIENT_ORIGIN = os.getenv('CLIENT_ORIGIN', 'http://localhost:5173')

client = MongoClient(MONGODB_URL)
db = client.get_default_database()
ai_messages = db.get_collection('ai_messages')

app = Flask(__name__)
CORS(app, resources={r"/api/ai/*": {"origins": [CLIENT_ORIGIN]}}, supports_credentials=False)


def farming_bot_response(user_text: str) -> str:
	"""Enhanced farming assistant with more comprehensive responses"""
	text = (user_text or '').lower()
	
	# Greetings and basic queries
	if any(k in text for k in ['hello', 'hi', 'hey', 'good morning', 'good afternoon']):
		return (
			"🌾 Hello! Welcome to your AI farming assistant. I'm here to help with:\n"
			"• Crop cultivation and management\n"
			"• Soil health and fertilization\n"
			"• Pest and disease control\n"
			"• Irrigation and water management\n"
			"• Weather-related farming advice\n\n"
			"What farming challenge can I help you with today?"
		)
	
	# Crop-specific advice
	if any(k in text for k in ['wheat', 'paddy', 'rice', 'maize', 'corn']):
		crop = next((k for k in ['wheat', 'paddy', 'rice', 'maize', 'corn'] if k in text), 'cereal')
		return (
			f"🌾 {crop.title()} Cultivation Tips:\n\n"
			"📅 **Timing**: Plant during optimal season for your region\n"
			"🌱 **Seeding**: Maintain proper seed rate (20-25 kg/ha for wheat, 15-20 kg/ha for rice)\n"
			"💧 **Water**: Critical stages - tillering, flowering, grain filling\n"
			"🧪 **Nutrition**: Split nitrogen application (50% basal, 25% tillering, 25% flowering)\n"
			"🔍 **Monitoring**: Regular field inspection for pests and diseases\n\n"
			"Need specific advice for your growth stage or location?"
		)
	
	if any(k in text for k in ['tomato', 'vegetable', 'potato', 'onion', 'carrot']):
		return (
			"🍅 Vegetable Cultivation Guide:\n\n"
			"🌱 **Seedlings**: Use certified, disease-free seedlings\n"
			"🔄 **Rotation**: Practice 3-4 year crop rotation\n"
			"🛡️ **Disease Prevention**: \n"
			"   • Apply copper-based fungicides preventively\n"
			"   • Ensure good air circulation\n"
			"   • Avoid overhead irrigation\n"
			"💧 **Irrigation**: Drip irrigation at root zone\n"
			"🌿 **Mulching**: Use organic mulch to retain moisture\n\n"
			"Which specific vegetable are you growing?"
		)
	
	# Water and irrigation
	if any(k in text for k in ['irrigation', 'water', 'drip', 'sprinkler', 'watering']):
		return (
			"💧 Smart Irrigation Management:\n\n"
			"🎯 **Drip Irrigation Benefits**:\n"
			"   • 30-50% water savings\n"
			"   • Better nutrient delivery\n"
			"   • Reduced weed growth\n"
			"   • Lower disease pressure\n\n"
			"⏰ **Timing**: Early morning (6-8 AM) or evening (6-8 PM)\n"
			"📊 **Monitoring**: Check soil moisture at root depth\n"
			"🌿 **Mulching**: Reduces evaporation by 50-70%\n\n"
			"💡 Pro tip: Use ET₀ data to calculate crop water requirements!"
		)
	
	# Soil and fertilization
	if any(k in text for k in ['soil', 'npk', 'fertilizer', 'ph', 'compost', 'manure']):
		return (
			"🧪 Soil Health Management:\n\n"
			"📋 **Annual Testing**: pH, EC, organic matter, NPK\n"
			"🎯 **Target pH**: 6.0-7.5 for most crops\n"
			"🌿 **Organic Matter**: \n"
			"   • Add compost (5-10 tonnes/ha)\n"
			"   • Green manure crops\n"
			"   • Crop residue incorporation\n\n"
			"⚗️ **Fertilizer Strategy**:\n"
			"   • Soil test-based application\n"
			"   • Split nitrogen doses\n"
			"   • Balance NPK ratio\n\n"
			"🔄 **Improvement**: Cover crops, reduced tillage, rotation"
		)
	
	# Pest management
	if any(k in text for k in ['pest', 'insect', 'ipm', 'aphid', 'borer', 'disease', 'fungus']):
		return (
			"🛡️ Integrated Pest Management (IPM):\n\n"
			"🔍 **Monitoring**: \n"
			"   • Weekly field scouting\n"
			"   • Pheromone traps\n"
			"   • Economic threshold levels\n\n"
			"🌱 **Prevention**:\n"
			"   • Resistant varieties\n"
			"   • Crop rotation\n"
			"   • Biological control agents\n\n"
			"🌿 **Natural Solutions**:\n"
			"   • Neem oil sprays\n"
			"   • Beneficial insects\n"
			"   • Companion planting\n\n"
			"⚗️ **Chemical Control**: Only when necessary, rotate modes of action"
		)
	
	# Weather and climate
	if any(k in text for k in ['weather', 'climate', 'rain', 'drought', 'temperature']):
		return (
			"🌤️ Weather-Smart Farming:\n\n"
			"📱 **Monitoring**: Use weather apps and local stations\n"
			"☔ **Rainfall Management**:\n"
			"   • Harvest rainwater\n"
			"   • Improve drainage\n"
			"   • Adjust planting dates\n\n"
			"🌡️ **Temperature Stress**:\n"
			"   • Shade nets for extreme heat\n"
			"   • Mulching for temperature regulation\n"
			"   • Proper ventilation in protected cultivation\n\n"
			"💨 **Wind Protection**: Windbreaks and shelter belts"
		)
	
	# Market and economics
	if any(k in text for k in ['price', 'market', 'sell', 'profit', 'cost']):
		return (
			"💰 Market Intelligence & Economics:\n\n"
			"📊 **Price Tracking**: Monitor daily market rates\n"
			"📅 **Timing**: Plan harvest for peak prices\n"
			"🎯 **Quality**: Focus on premium grade produce\n"
			"🤝 **Direct Sales**: Farmers markets, online platforms\n"
			"💼 **Value Addition**: Processing, packaging\n"
			"📋 **Record Keeping**: Track costs and returns\n\n"
			"💡 Tip: Diversify crops to spread market risk!"
		)
	
	# Default response
	return (
		"🌾 Welcome to your AI Farming Assistant! I can help with:\n\n"
		"🌱 **Crop Management**: Cultivation practices, varieties\n"
		"💧 **Water Management**: Irrigation, drainage systems\n"
		"🧪 **Soil Health**: Testing, fertilization, improvement\n"
		"🛡️ **Pest Control**: IPM strategies, organic solutions\n"
		"🌤️ **Weather Advisory**: Climate-smart practices\n"
		"💰 **Market Intelligence**: Pricing, selling strategies\n\n"
		"Tell me about your crop, growth stage, and location for personalized advice!"
	)


@app.route('/api/ai/chat', methods=['POST'])
def chat():
	try:
		body = request.get_json(force=True) or {}
		session_id = body.get('sessionId') or os.urandom(8).hex()
		user_id = body.get('userId')
		message = (body.get('message') or '').strip()

		# Input validation
		if not message:
			return jsonify({"success": False, "message": "message required"}), 400
		
		if len(message) > 1000:
			return jsonify({"success": False, "message": "message too long"}), 400

		# Store user message
		ai_messages.insert_one({
			'sessionId': session_id,
			'userId': user_id,
			'role': 'user',
			'content': message,
			'createdAt': datetime.utcnow()
		})

		# Generate AI response
		reply = farming_bot_response(message)

		# Store AI response
		ai_messages.insert_one({
			'sessionId': session_id,
			'userId': user_id,
			'role': 'assistant',
			'content': reply,
			'createdAt': datetime.utcnow()
		})

		return jsonify({
			"success": True,
			"sessionId": session_id,
			"reply": reply
		})
	
	except Exception as e:
		print(f"Chat error: {str(e)}")
		return jsonify({"success": False, "message": "Internal server error"}), 500


@app.route('/api/ai/history/<session_id>', methods=['GET'])
def history(session_id: str):
	try:
		# Input validation
		if not session_id or len(session_id) > 100:
			return jsonify({"success": False, "message": "Invalid session ID"}), 400
		
		docs = list(ai_messages.find({ 'sessionId': session_id }).sort('createdAt', 1))
		msgs = []
		for d in docs:
			if d.get('createdAt'):
				msgs.append({
					'role': d.get('role'), 
					'content': d.get('content'), 
					'createdAt': d.get('createdAt').isoformat()
				})
		
		return jsonify({ "success": True, "messages": msgs })
	
	except Exception as e:
		print(f"History error: {str(e)}")
		return jsonify({"success": False, "message": "Internal server error"}), 500


@app.route('/api/ai/soil', methods=['POST'])
def soil():
    try:
        if 'image' not in request.files:
            return jsonify({ 'success': False, 'message': 'image file required' }), 400
        
        f = request.files['image']
        
        # Validate file size (limit to 10MB)
        if f.content_length and f.content_length > 10 * 1024 * 1024:
            return jsonify({ 'success': False, 'message': 'file too large (max 10MB)' }), 400
        
        # Validate file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if f.content_type not in allowed_types:
            return jsonify({ 'success': False, 'message': 'invalid file type' }), 400
        data = f.read()
        
        # Additional file size check after reading
        if len(data) > 10 * 1024 * 1024:
            return jsonify({ 'success': False, 'message': 'file too large' }), 400
        
        image = Image.open(io.BytesIO(data)).convert('RGB')
        # resize for speed and consistency
        image = image.resize((256, 256))
        arr = np.asarray(image)
        
        # compute simple metrics
        brightness = float(arr.mean())  # 0-255
        # crude dryness: high brightness + low variance
        variance = float(arr.var())
        # salinity suspicion: high fraction of near-white pixels
        near_white = np.mean(np.all(arr > 230, axis=2))

        status = 'healthy'
        advice = 'Soil looks fine. Maintain moisture and add compost for organic matter.'
        if brightness > 180 and variance < 2000:
            status = 'dry'
            advice = 'Soil appears dry. Mulch and apply light, frequent irrigation.'
        if near_white > 0.08:
            status = 'salinity suspected'
            advice = 'White crust detected. Flush salts with good water; add gypsum if soil test confirms.'

        return jsonify({ 'success': True, 'result': {
            'status': status,
            'advice': advice,
            'metrics': {
                'brightness': round(brightness, 2),
                'variance': round(variance, 2),
                'nearWhiteRatio': round(float(near_white), 3)
            }
        }})
    
    except Exception as e:
        print(f"Soil analysis error: {str(e)}")
        return jsonify({ 'success': False, 'message': 'Failed to analyze soil image' }), 500


if __name__ == '__main__':
	port = int(os.getenv('AI_SERVER_PORT', '8000'))
	app.run(host='0.0.0.0', port=port)
