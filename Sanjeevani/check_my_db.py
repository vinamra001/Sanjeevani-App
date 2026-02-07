import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AyurRecSys.settings')
django.setup()

from django.apps import apps

def check_data():
    try:
        # 1. Try to find the Disease model in 'api' app
        # If your app is named differently, change 'api' below
        Disease = apps.get_model('api', 'Disease')
        count = Disease.objects.count()
        
        print("\n" + "="*40)
        print(f"🌿 SANJEEVANI DATABASE STATUS 🌿")
        print("="*40)
        print(f"Total Diseases in Database: {count}")
        
        if count > 0:
            d = Disease.objects.first()
            print(f"\n✅ SUCCESS: Found data for '{d.name}'")
            
            # Show all fields so we find the remedy data
            fields = [f.name for f in d._meta.get_fields()]
            print(f"Available Data Fields: {fields}")
            
            # Let's try to print the actual remedy content
            for possible in ['remedy', 'treatment', 'chikitsa', 'description']:
                if hasattr(d, possible):
                    content = getattr(d, possible)
                    print(f"\n--- {possible.upper()} CONTENT ---")
                    print(content[:200] + "..." if content else "Field is Empty")
        else:
            print("\n🚨 WARNING: Tables exist, but they are EMPTY.")
            print("You need to upload your Ayurvedic data.")
            
    except LookupError:
        print("\n❌ ERROR: Could not find the 'Disease' model.")
        print("Please check if 'api' is the correct app name in settings.py")
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")

if __name__ == "__main__":
    check_data()