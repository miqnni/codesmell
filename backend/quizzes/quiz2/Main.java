public class HelloWorld {

    public String getMessage() {
        return "Hello, world!"
    }

    public static void main(String[] args) {
        HelloWorld hw = new HelloWorld();
        System.out.println(hw.getMessage());
    }
}