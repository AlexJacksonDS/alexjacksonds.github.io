import "./football-pitch.scss";

export default function FootballPage() {
  return (
    <div>
      <div className="football-pitch">
        {[0, 1].map((x) => (
          <div key={x} className={"half" + (x === 1 ? " other" : "")}>
            <div className="corner">
              <div className="corner-circle"></div>
            </div>
            <div className="box">
              <div></div>
              <div className="six-box"></div>
              <div></div>
              <div></div>
              <div className="p-spot-container">
                <div className="p-spot"></div>
              </div>
              <div></div>
            </div>
            <div className="corner other">
              <div className="corner-circle"></div>
            </div>
            <div></div>
            <div className="mid-half">
              <div className="penalty-d"></div>
            </div>
            <div></div>
            <div></div>
            <div className="centre-box">
              <div className="centre-circle">
                <div className="centre-spot"></div>
              </div>
            </div>
            <div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
