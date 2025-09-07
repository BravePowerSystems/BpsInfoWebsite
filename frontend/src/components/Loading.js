import "../scss/components/Loading.scss";

export default function Loading({ text = "Loading..." }) {
    return (
        <div className="loading-container">
            <p className="loading-text">{text}</p>
        </div>
    );
}
