class CorsMiddle:
    def __init__(self, get_response): 
        self.get_response = get_response 
        
    def __call__(self, request):         
        # code here for processing request check 
        response = self.get_response(request)
        # code here for processing response modify 
        if request.method == "OPTIONS": 
            # 注意, 对所有请求都要给出一个 
            # Access-Control-Allow-Origin
            # 只是对于OPTIONS需要设置时长从而避免频繁询问 
            response['Access-Control-Allow-Headers'] = 'x-csrftoken' 
            response['Access-Control-Allow-Methods'] = 'POST,GET,OPTIONS' 
            response['Access-Control-Max-Age'] = 3600 
            response['Access-Control-Allow-Origin'] = '*' 
            return response
        else:
            return response