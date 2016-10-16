import com.github.sarxos.webcam.Webcam;
import com.github.sarxos.webcam.WebcamUtils;
import java.io.File;
import java.awt.image.BufferedImage;
import java.io.IOException;
import javax.imageio.ImageIO;
import java.util.Base64;

public class Camera {
    public static void main(String[] args) throws IOException{
        takePic();
    }

    private static String takePic() throws IOException{
        // get default webcam and open it
        Webcam webcam = Webcam.getDefault();
        webcam.open();

        // get image
        BufferedImage image = webcam.getImage();

        // save image to PNG file and encode it as base64
        ImageIO.write(image, "PNG", new File("test.png"));
        byte[] bytes = WebcamUtils.getImageBytes(webcam, "jpg");
        return Base64.getEncoder().encodeToString(bytes);
    }
}
