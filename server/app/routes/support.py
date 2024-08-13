from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import User, SupportTicket
from datetime import datetime

support = Blueprint('support', __name__)

# Route to submit a new support ticket
@support.route('/support/tickets', methods=['POST'])
@jwt_required()
def submit_ticket():
    user_id = get_jwt_identity()
    data = request.get_json()

    subject = data.get('subject')
    message = data.get('message')

    if not subject or not message:
        return jsonify({"message": "Subject and message are required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    new_ticket = SupportTicket(
        subject=subject,
        message=message,
        user_id=user_id,
        status='open'
    )

    db.session.add(new_ticket)
    db.session.commit()

    return jsonify({
        "message": "Support ticket submitted successfully",
        "ticket": {
            "id": new_ticket.id,
            "subject": new_ticket.subject,
            "message": new_ticket.message,
            "status": new_ticket.status,
            "user_id": new_ticket.user_id,
            "username": user.username,
            "email": user.email,
            "created_at": new_ticket.created_at
        }
    }), 201
