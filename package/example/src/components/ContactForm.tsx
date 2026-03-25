import { Input } from "./Input";
import { TextArea } from "./TextArea";
import { Button } from "./Button";

export function ContactForm() {
  return (
    <form
      style={{ display: "flex", "flex-direction": "column", gap: "0.75rem" }}
      onSubmit={(e) => e.preventDefault()}
    >
      <Input type="text" label="Name" placeholder="Enter your name" />
      <TextArea label="Message" placeholder="Write something..." rows="3" />
      <Button type="submit" style={{ "align-self": "flex-start", padding: "0.5rem 1.5rem" }}>
        Submit
      </Button>
    </form>
  );
}
