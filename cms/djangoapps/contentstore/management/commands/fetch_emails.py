from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = '''Fetch all user emails and print them to stdout.'''

    def handle(self, *args, **options):
        if len(args) != 0:
            raise CommandError("fetch_emails requires no arguments")

        users = User.objects.all()
        user_emails = [user.email for user in users]
        self.stdout.write(user_emails)
