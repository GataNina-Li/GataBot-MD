#include <napi.h>
#include <unistd.h>

using namespace Napi;

Value Nice(const CallbackInfo& args) {
  int32_t inc = args[0].ToNumber();
  errno = 0;
  int32_t ret = nice(inc);
  if (errno != 0) {
    throw Error::New(
        args.Env(), std::string("nice(): ") + strerror(errno));
  }
  return Number::New(args.Env(), ret);
}

static Object Init(Env env, Object exports) {
  exports["nice"] = Function::New(env, Nice);
  return exports;
}

NODE_API_MODULE(nice_napi, Init)
