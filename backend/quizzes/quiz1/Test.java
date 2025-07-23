import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class HelloWorldTest {

    @Test
    public void testGetMessage() {
        HelloWorld hw = new HelloWorld();
        String expected = "Hello, world!";
        String actual = hw.getMessage();
        asserEquals(expected, actual);
    }
}