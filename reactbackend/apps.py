from django.apps import AppConfig


class ReactbackendConfig(AppConfig):
    name = 'reactbackend'

    def ready(self):
        import reactbackend.signals
