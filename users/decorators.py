from django.shortcuts import redirect


def unauthenticated_user(view_func):
    def wrapper_func(request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('home')
        else:
            return view_func(request, *args, **kwargs)

    return wrapper_func


def session_variable_get(needed_in_session=[], redirect_page='home'):
    def decorator(view_func):
        def wrapper_func(request, *args, **kwargs):
            for variable in needed_in_session:
                if request.session.get(variable) == None:
                    return redirect(redirect_page)
            return view_func(request, *args, **kwargs)

        return wrapper_func
    return decorator
