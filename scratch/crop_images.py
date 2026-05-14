from PIL import Image
import os

def crop_and_save(img, coords, name):
    crop = img.crop(coords)
    crop.save(os.path.join('public', name))
    print(f'Saved {name} with size {crop.size}')

img = Image.open('public/mockup.png')
w, h = img.size

# Estimates for 1920x912
# Grid is roughly 3x3 with margins.
# Let's adjust based on the visual proportions.
# The gaps are visible.

# Row 1: y from 0 to ~300
# Row 2: y from ~300 to ~600
# Row 3: y from ~600 to 912

# Column 1: x from 0 to ~640
# Column 2: x from ~640 to ~1280
# Column 3: x from ~1280 to 1920

# App Screen (Bottom Middle)
# Let's use more precise bounds based on visual alignment.
# Bottom row starts at around y=610
# Middle column is roughly 645 to 1275
crop_and_save(img, (645, 610, 1275, 885), 'app_screen.png')

# Delivery Uniform (Bottom Left)
crop_and_save(img, (35, 610, 635, 885), 'delivery_uniform.png')

# Van Branding (Middle Middle)
# Middle row starts at around y=320
crop_and_save(img, (645, 320, 1275, 595), 'van_branding.png')

# Luggage Tag (Middle Right)
crop_and_save(img, (1285, 320, 1885, 595), 'luggage_tag.png')
