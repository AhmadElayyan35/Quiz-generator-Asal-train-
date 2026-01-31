def normalize_email(email: str):
    local_part, at, domain = email.lower().partition("@")
    normalized_local = local_part.replace(".", "")
    return f"{normalized_local}@{domain}"
