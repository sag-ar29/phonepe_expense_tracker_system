from typing import Dict, List

# Smart merchant keyword dictionary (Case-insensitive matching)
CATEGORY_MAP: Dict[str, List[str]] = {
    "Food": ["swiggy", "zomato", "canteen", "tea stall", "restaurant", "cafe", "mcdonalds", "starbucks", "instamart", "blinkit", "zepto"],
    "Travel": ["ola", "uber", "rapido", "metro", "petrol", "fuel", "hpcl", "bpcl", "irctc", "flight", "indigo", "toll"],
    "Shopping": ["dmart", "amazon", "flipkart", "myntra", "meesho", "ajio", "reliancedigital", "croma", "supermarket", "store"],
    "Bills": ["recharge", "electricity", "bescom", "wifi", "airtel", "jio", "broadband", "ticket", "bill", "water", "gas"],
    "Health": ["pharmacy", "medical", "gym", "hospital", "doctor", "apollo", "1mg", "cult", "fitness"],
    "Entertainment": ["netflix", "spotify", "youtube", "cinema", "movie", "prime", "hotstar", "bookmyshow"],
    "Other": ["misc", "other", "cash", "transfer"]
}

def get_category(merchant_name: str) -> str:
    """Classify merchant name into standard spending category."""
    if not merchant_name:
        return "Other"
    
    clean_merchant = merchant_name.lower().strip()
    
    for category, keywords in CATEGORY_MAP.items():
        for keyword in keywords:
            if keyword in clean_merchant:
                return category
                
    return "Other"

