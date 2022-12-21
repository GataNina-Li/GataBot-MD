#ifndef CGIF_H
#define CGIF_H

#include <stdint.h>
#include <stdio.h>

#ifdef __cplusplus
extern "C" {
#endif

// flags to set the GIF/frame-attributes
#define CGIF_ATTR_IS_ANIMATED            (1uL << 1)       // make an animated GIF (default is non-animated GIF)
#define CGIF_ATTR_NO_GLOBAL_TABLE        (1uL << 2)       // disable global color table (global color table is default)
#define CGIF_ATTR_HAS_TRANSPARENCY       (1uL << 3)       // first entry in color table contains transparency
#define CGIF_FRAME_ATTR_USE_LOCAL_TABLE  (1uL << 0)       // use a local color table for a frame (local color table is not used by default)
// flags to decrease GIF-size
#define CGIF_FRAME_GEN_USE_TRANSPARENCY  (1uL << 0)       // use transparency optimization (setting pixels identical to previous frame transparent)
#define CGIF_FRAME_GEN_USE_DIFF_WINDOW   (1uL << 1)       // do encoding just for the sub-window that has changed from previous frame

#define CGIF_INFINITE_LOOP               (0x0000uL)       // for animated GIF: 0 specifies infinite loop

typedef enum {
  CGIF_ERROR = -1, // something unspecified failed
  CGIF_OK    =  0, // everything OK
  CGIF_EWRITE,     // writing GIF data failed
  CGIF_EALLOC,     // allocating memory failed
  CGIF_ECLOSE,     // final call to fclose failed
  CGIF_EOPEN,      // failed to open output file
  CGIF_EINDEX,     // invalid index in image data provided by user
  // internal section (values subject to change)
  CGIF_PENDING,
} cgif_result;

typedef struct st_gif         CGIF;                      // struct for the full GIF
typedef struct st_frame       CGIF_Frame;                // struct for a single frame
typedef struct st_gifconfig    CGIF_Config;                // global cofinguration parameters of the GIF
typedef struct st_frameconfig  CGIF_FrameConfig;           // local configuration parameters for a frame

typedef int cgif_write_fn(void* pContext, const uint8_t* pData, const size_t numBytes); // callback function for stream-based output

// prototypes
CGIF* cgif_newgif     (CGIF_Config* pConfig);                  // creates a new GIF (returns pointer to new GIF or NULL on error)
int   cgif_addframe   (CGIF* pGIF, CGIF_FrameConfig* pConfig); // adds the next frame to an existing GIF (returns 0 on success)
int   cgif_close      (CGIF* pGIF);                          // close file and free allocated memory (returns 0 on success)

// CGIF_Config type (parameters passed by user)
// note: must stay AS IS for backward compatibility
struct st_gifconfig {
  uint8_t*    pGlobalPalette;                            // global color table of the GIF
  const char* path;                                      // path of the GIF to be created, mutually exclusive with pWriteFn
  uint32_t    attrFlags;                                 // fixed attributes of the GIF (e.g. whether it is animated or not)
  uint32_t    genFlags;                                  // flags that determine how the GIF is generated (e.g. optimization)
  uint16_t    width;                                     // width of each frame in the GIF
  uint16_t    height;                                    // height of each frame in the GIF
  uint16_t    numGlobalPaletteEntries;                   // size of the global color table
  uint16_t    numLoops;                                  // number of repetitons of an animated GIF (set to INFINITE_LOOP for infinite loop)
  cgif_write_fn *pWriteFn;                               // callback function for chunks of output data, mutually exclusive with path
  void*       pContext;                                  // opaque pointer passed as the first parameter to pWriteFn
};

// CGIF_FrameConfig type (parameters passed by user)
// note: must stay AS IS for backward compatibility
struct st_frameconfig {
  uint8_t*  pLocalPalette;                             // local color table of a frame
  uint8_t*  pImageData;                                // image data to be encoded
  uint32_t  attrFlags;                                 // fixed attributes of the GIF frame
  uint32_t  genFlags;                                  // flags that determine how the GIF frame is created (e.g. optimization)
  uint16_t  delay;                                     // delay before the next frame is shown (units of 0.01 s)
  uint16_t  numLocalPaletteEntries;                    // size of the local color table
};

// CGIF_Frame type
// note: internal sections, subject to change in future versions
struct st_frame {
  CGIF_FrameConfig   config;                             // (internal) configutation parameters of the frame (see above)
  struct st_frame*  pBef;                              // (internal) pointer to frame before (needed e.g. for transparency optimization)
  struct st_frame*  pNext;                             // (internal) pointer to next frame
  uint8_t*          pRasterData;                       // (internal) pointer to LZW-data
  uint32_t          sizeRasterData;                    // (internal) size of the LZW-data
  uint16_t          initDictLen;                       // (internal) length of the initial color dictionary (maximum 256)
  uint16_t          width;                             // actual width of frame
  uint16_t          height;                            // actual height of frame
  uint16_t          top;                               // actual top offset of frame
  uint16_t          left;                              // actual left offset of frame
  uint8_t           transIndex;                        // (internal) index indicating transparent pixel
  uint8_t           aGraphicExt[8];                    //
  uint8_t           aImageHeader[10];                  // (internal) header of the frame
  uint8_t           aLocalColorTable[256 * 3];         //
  uint8_t           initCodeLen;                       // initial length of the LZW-codes in bits (minimum 3, maximum 12)
};

// CGIF type
// note: internal sections, subject to change in future versions
struct st_gif {
  CGIF_Config config;                                      // (internal) configutation parameters of the GIF (see above)
  FILE*        pFile;
  uint8_t      aHeader[13];                              // (internal) header of the GIF
  uint8_t      aGlobalColorTable[256 * 3];               // (internal) global color table
  uint8_t      aAppExt[19];                              //
  CGIF_Frame*  pCurFrame;                                // (internal) pointer to current frame
  CGIF_Frame   firstFrame;                                // (internal) pointer to next frame
  cgif_result  curResult;
};

#ifdef __cplusplus
}
#endif

#endif // CGIF_H
