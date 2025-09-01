from PIL import Image, ImageDraw

def generate_placeholder(width, height, color1, color2, filename):
    img = Image.new('RGB', (width, height), color1)
    draw = ImageDraw.Draw(img)

    # A simple pattern
    for i in range(0, width, 20):
        draw.line((i, 0, i, height), fill=color2)
    for i in range(0, height, 20):
        draw.line((0, i, width, i), fill=color2)

    img.save(filename)

# G004: Product Photo
generate_placeholder(1500, 1500, '#A67C52', '#F5F0E6', 'assets/G004_product_photo.jpg')

# G005: Lifestyle Photo
generate_placeholder(2500, 1667, '#E4C9C9', '#F5F0E6', 'assets/G005_lifestyle_photo.jpg')

# G009: Testimonial Photo
generate_placeholder(800, 800, '#F5F0E6', '#E4C9C9', 'assets/G009_testimonial_photo.jpg')

# G010: Blog Illustration
generate_placeholder(1200, 800, '#E4C9C9', '#F5F0E6', 'assets/G010_blog_illustration.jpg')

# G011: Infographic
generate_placeholder(1500, 2000, '#F8F8F8', '#8FA998', 'assets/G011_infographic.png')

# G012: Email Banner
generate_placeholder(600, 400, '#F8F8F8', '#A67C52', 'assets/G012_email_banner.jpg')
