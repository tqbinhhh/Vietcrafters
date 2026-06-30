from PIL import Image

def create_favicon():
    img = Image.open('public/images/logo.png')
    img = img.convert("RGBA")
    data = img.load()
    width, height = img.size
    
    # find left bound
    min_x = width
    for x in range(width):
        found = False
        for y in range(height):
            if data[x,y][3] > 10:
                min_x = x
                found = True
                break
        if found: break
        
    # find gap after symbol (assume symbol is followed by text)
    gap_start = min_x
    for x in range(min_x, width):
        # check if this column is empty
        empty = True
        for y in range(height):
            if data[x,y][3] > 10:
                empty = False
                break
        if empty:
            # Check if gap is wide enough to be space between symbol and text
            gap_width = 0
            for gap_x in range(x, width):
                gap_empty = True
                for y in range(height):
                    if data[gap_x, y][3] > 10:
                        gap_empty = False
                        break
                if not gap_empty:
                    break
                gap_width += 1
            if gap_width > 10:
                gap_start = x
                break
    
    # If gap not found properly, fallback to square crop
    if gap_start == min_x or gap_start > width / 2:
        gap_start = min_x + height

    max_x = gap_start
    
    # crop symbol
    symbol = img.crop((min_x, 0, max_x, height))
    
    # calculate new square size
    sym_w, sym_h = symbol.size
    size = max(sym_w, sym_h) + 20 # Add 10px padding on all sides
    
    favicon = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    offset_x = (size - sym_w) // 2
    offset_y = (size - sym_h) // 2
    favicon.paste(symbol, (offset_x, offset_y))
    
    favicon.save('public/images/favicon.png')
    
    # also save to root images if it exists
    import os
    if os.path.exists('images'):
        favicon.save('images/favicon.png')
        print("Saved to images/favicon.png")
    
    print(f"Cropped symbol from x={min_x} to {max_x}. Saved as favicon.png")

create_favicon()
