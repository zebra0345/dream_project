package com.garret.dreammoa.utils;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;

public class FileUtils {

    public static void saveFile(MultipartFile multipartFile, String filePath) throws IOException {
        File file = new File(filePath);
        multipartFile.transferTo(file);
    }

}
