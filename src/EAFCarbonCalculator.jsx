import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";

const emissionFactors = {
  "天然气": { unit: "万Nm³", factor: 21.65 },
  "废钢": { unit: "吨", factor: 0.015 },
  "石灰": { unit: "吨", factor: 1.024 },
  "轻烧白云石": { unit: "吨", factor: 1.024 },
  "电极": { unit: "吨", factor: 3.663 },
  "增碳剂、碳粉": { unit: "吨", factor: 3.667 },
    "电力": { unit: "万kWh", factor: 5.568 },
  "蒸汽（净使用）": { unit: "万吨", factor: 0.1100 },
  "铁水、生铁": { unit: "吨", factor: 1.739 },
  "钢坯": { unit: "吨", factor: 0.0154 }
};

export default function EAFCarbonCalculator() {
  const [inputs, setInputs] = useState(() => {
    const init = {};
    Object.keys(emissionFactors).forEach(key => init[key] = 0);
    init["废钢"] = 100;
    init["电力"] = 30000;
    return init;
  });

  const handleChange = (material, value) => {
    setInputs((prev) => ({ ...prev, [material]: parseFloat(value) || 0 }));
  };

  const totalEmissions = Object.entries(inputs).reduce((total, [material, amount]) => {
    const { factor } = emissionFactors[material];
    return total + amount * factor;
  }, 0);

  const steelOutput = inputs["废钢"] || 1; // 万吨，避免除以0
  const emissionIntensity = totalEmissions / (steelOutput * 10000); // 吨CO2/吨钢

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">电弧炉碳排放计算器（基于排放因子）</h1>
      <Card>
        <CardContent className="space-y-4 p-4">
          {Object.entries(emissionFactors).map(([material, { unit }]) => (
            <div key={material}>
              <Label>{material} 用量（{unit}）</Label>
              <Input
                type="number"
                value={inputs[material]}
                onChange={(e) => handleChange(material, e.target.value)}
              />
            </div>
          ))}

          <div className="border-t pt-4">
            <p>🌍 碳排放总量：<strong>{totalEmissions.toFixed(2)}</strong> 吨CO₂</p>
            <p>📊 碳排强度：<strong>{emissionIntensity.toFixed(4)}</strong> 吨CO₂ / 吨钢</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
