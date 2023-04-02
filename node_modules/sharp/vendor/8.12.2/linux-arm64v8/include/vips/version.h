/* Macros for the header version.
 */

#ifndef VIPS_VERSION_H
#define VIPS_VERSION_H

#define VIPS_VERSION		"8.12.2"
#define VIPS_VERSION_STRING	"8.12.2-Tue Jan 25 09:34:32 UTC 2022"
#define VIPS_MAJOR_VERSION	(8)
#define VIPS_MINOR_VERSION	(12)
#define VIPS_MICRO_VERSION	(2)

/* The ABI version, as used for library versioning.
 */
#define VIPS_LIBRARY_CURRENT	(56)
#define VIPS_LIBRARY_REVISION	(2)
#define VIPS_LIBRARY_AGE	(14)

#define VIPS_CONFIG		"enable debug: no, enable deprecated library components: no, enable modules: no, use fftw3 for FFT: no, accelerate loops with orc: yes, ICC profile support with lcms: yes (lcms2), zlib: yes (found by search), text rendering with pangocairo: yes, font file support with fontconfig: yes, RAD load/save: no, Analyze7 load/save: no, PPM load/save: no, GIF load:  yes, GIF save with cgif: yes, EXIF metadata support with libexif: yes, JPEG load/save with libjpeg: yes (pkg-config), JXL load/save with libjxl: no (dynamic module: no), JPEG2000 load/save with libopenjp2: no, PNG load with libspng: yes, PNG load/save with libpng: yes (pkg-config libpng >= 1.2.9), quantisation to 8 bit: yes, TIFF load/save with libtiff: yes (pkg-config libtiff-4), image pyramid save: yes, HEIC/AVIF load/save with libheif: yes (dynamic module: no), WebP load/save with libwebp: yes, PDF load with PDFium:  no, PDF load with poppler-glib: no (dynamic module: no), SVG load with librsvg-2.0: yes, EXR load with OpenEXR: no, OpenSlide load: no (dynamic module: no), Matlab load with matio: no, NIfTI load/save with niftiio: no, FITS load/save with cfitsio: no, Magick package: none (dynamic module: no), Magick API version: none, load with libMagickCore: no, save with libMagickCore: no"

/** 
 * VIPS_SONAME:
 *
 * The name of the shared object containing the vips library, for example
 * "libvips.so.42", or "libvips-42.dll".
 */

#include "soname.h"

/* Not really anything to do with versions, but this is a handy place to put
 * it.
 */
#define VIPS_EXEEXT ""
#define VIPS_ENABLE_DEPRECATED 0

#endif /*VIPS_VERSION_H*/
