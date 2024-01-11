import './OthelloSquare.scss';

export default function OthelloSquare(props: {
    moveCandidate: boolean;
    value: 0 | 1 | 2;
    onClick: any;// (i: number, j: number) => void;
}) {
    return (
        <div className={`faux-borders${props.moveCandidate ? " move" : ""}`}>
            <div className="square" onClick={props.onClick}>
                <div className={"circle " + (props.value === 1 ? "white" : props.value === 2 ? "black" : "none")}></div>
            </div>
        </div>
    );
}