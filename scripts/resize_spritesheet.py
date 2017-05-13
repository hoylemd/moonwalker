import argparse
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser(description='resize a sprite atlas')
parser.add_argument('file_path', type=str,
                    help='path to the texture atlas to resize')
parser.add_argument('new_unit', type=int,
                    help='the new size for the sprite sheet')
parser.add_argument('output_path', type=str,
                    help='path to write the new atlas to')


DEFAULT_UNIT = 128


def main(parser):
    args = parser.parse_args()

    tree = ET.parse(args.file_path)
    new_tree = convert_atlas(tree, DEFAULT_UNIT, args.new_unit)

    new_tree.write(args.output_path)


def convert_atlas(document, current_unit, new_unit):
    """Convert a list of entries to a new unit dimension

    Parameters
    ----------
    document : xml.etree.ElementTree
        parsed xml texture atlas
    current_unit : int
        the current unit of the atlas (usually 128)
    new_unit : int
        the new unit dimension to resize the sprites to

    Returns
    -------
    xml.etree.ElementTree
        The modified document
    """
    root = document.getroot()

    for subtexture in root:
        x, y = subtexture.attrib['x'], subtexture.attrib['y']
        subtexture.attrib['x'] = str((int(x) / current_unit) * new_unit)
        subtexture.attrib['y'] = str((int(y) / current_unit) * new_unit)
        subtexture.attrib['width'] = str(new_unit)
        subtexture.attrib['height'] = str(new_unit)

    return document

if __name__ == '__main__':
    main(parser)
