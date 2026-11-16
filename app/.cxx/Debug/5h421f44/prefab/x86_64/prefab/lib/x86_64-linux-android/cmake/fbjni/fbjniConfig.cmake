if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "C:/Users/Asus/scoop/apps/gradle/current/.gradle/caches/8.10.2/transforms/db32bc1a742285cd67118e9f7c984c0e/transformed/fbjni-0.6.0/prefab/modules/fbjni/libs/android.x86_64/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/Asus/scoop/apps/gradle/current/.gradle/caches/8.10.2/transforms/db32bc1a742285cd67118e9f7c984c0e/transformed/fbjni-0.6.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

