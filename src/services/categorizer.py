CATEGORY_MAP : dict[str, list[str]] = {
                                        "food" : ["swiggy","zomato","canteen","tea Stall","restaurant"],
                                        "Travel" : ["ola","uber" , "rapido" , "metro", "petrol"],
                                        "Shopping": ["dmart","amazon" , "flipkart" , "myntra"],
                                        "bills" : ["recharge" , "electricity", "wifi", "ticket" , "bill"],
                                        "Health" : ["pharmacy", "gym"],
                                        "Entertainement" : ["netflix","spotify","youtube","music"],
                                        "other": ["misc","other"],
                                        }

def get_category(merchant_name : str) -> str:
    """ get the category for given merchant name """
    merchant_clean = merchant_name.lower().strip()
    for category, keywords in CATEGORY_MAP.items():
        for keyword in keywords: 
            if keyword in merchant_clean:
                return category
    return "Other"

# if __name__ == "__main__":
#     print(get_category("Uber Ride"))    
#     print(get_category("i am swiggy"))      
#     print(get_category("i ma go to goa"))  
