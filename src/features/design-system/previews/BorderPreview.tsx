import styles from "./BorderPreview.module.css";

function BorderPreview({ color }: { color: string }) {
  return (
    <div className={styles.borderPreview}>
      <div
        style={{
          border: `1px solid ${color}`,
          height: "100%",
        }}
        className={styles.borderItem}
      ></div>
      <div
        style={{
          border: `2px dashed ${color}`,
          height: "100%",
        }}
        className={styles.borderItem}
      ></div>
      <div
        style={{
          border: `2px dotted ${color}`,
          height: "100%",
        }}
        className={styles.borderItem}
      ></div>
      <div
        style={{
          border: `6px double ${color}`,
          height: "100%",
        }}
        className={styles.borderItem}
      ></div>
    </div>
  );
}

export default BorderPreview;
