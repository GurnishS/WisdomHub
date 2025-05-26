function MyApp({ pdfLink, thumbLink }) {
  return (
    <div className="flex justify-center items-center">
      <img src={thumbLink} alt="pdf" />
    </div>
  );
}

export default MyApp;
