# spcdeco — Launch Decompression Calculator

`index.html` is a self-contained interactive tool that estimates the **launch depressurization (decompression) loads** on a spacecraft compartment, equipment box or sandwich cavity inside the launcher fairing. It implements the zero-dimensional venting model of **A. Pagani et al., Appunti di Strutture per Veicoli Spaziali, PoliTo, 2026** (`svsbook_light.pdf`). Both models treat the gas in the compartment as compressible. They differ in the vent flow law: compressible orifice flow with choking (Pagani & Carrera, 2016), or the incompressible orifice loss law for small Δp (Sanz-Andrés *et al.*, 1997).

During ascent the fairing pressure `pe(t)` drops from about 1 atm to vacuum in a minute or two. If the gas trapped in a compartment cannot escape through its vents fast enough, a differential pressure `Δp(t) = p0(t) − pe(t)` builds up on the walls. The tool gives you the **peak differential pressure Δp_max**, the time at which it occurs, the venting time scales, the sonic-flow phase, a structural margin and the vent area needed to meet an allowable load.

---

## 1. Getting started

1. Download or clone the repository.
2. Open **`index.html`** in any modern browser (Chrome, Edge, Firefox or Safari). You don't need a server, an installation or an internet connection.
3. Pick a launcher, enter the compartment volume and the vent area. The results update as you type.

To try the reference case from the book, click **UPM-Sat 1 · Case 1/2/3** in the *Examples* card.

---

## 2. Screen layout

| Area | Content |
|---|---|
| **Top bar** | *Copy link* (a URL that reproduces the current inputs), *Export CSV* (the full time history), *Report* (print or save as PDF), light/dark theme toggle. |
| **Left column: inputs** | Five numbered sections (launcher, compartment, venting, model, structural check), plus example presets. |
| **KPI row** | Δp_max (hero figure, with a unit selector: Pa, kPa, mbar, psi), venting time `tc`, time ratio `K` with a venting-regime badge, start of the sonic phase, and the design load or margin of safety. |
| **Ascent snapshot** | A schematic of the fairing and compartment at a selected instant. The fill intensity shows the pressure, and the arrows show the vent mass flow; they turn amber and a **SONIC** tag appears when the vents are choked. The bars show `pe`, `p0`, `Δp` and the mass flow. Use **▶** to animate the ascent, or drag the slider. |
| **Charts** | Pressure history · Δp(t) · gas density · gas temperature · sonic-phase check `r = pe/p0` · design chart `δ_max` vs `K`. Hover any chart for a crosshair read-out. Click a time chart to move the snapshot to that instant. |
| **Vent sizing** | The minimum vent area, and the matching number of holes, that keeps the load within the allowable. Shown only after you set an allowable Δp. |
| **Detailed results** | Every computed quantity, with its symbol and the equation number in A. Pagani et al., Appunti di Strutture per Veicoli Spaziali, PoliTo, 2026. |

If an input is invalid, the field is outlined in red and a message appears above the results. The last valid results stay on screen until you correct it.

---

## 3. Inputs

### 3.1 Launcher & fairing pressure

| Option | What it does |
|---|---|
| **Ariane 40 / 42P / 44P, Delta 3920 (max/min), CZ-2E** | Gaussian fairing profile `pe/p_init = exp[−(t/tp)²]` (Eq. A.53), with the characteristic time `tp` from **Table A.1** (ESA Launch Vehicle Catalogue): 75, 73, 53, 57, 44 and 58 s. |
| **Custom characteristic time tp** | The same Gaussian law with your own `tp` in seconds. |
| **From max. depressurization rate** | Launcher user's manuals usually give the maximum fairing depressurization rate, for example in kPa/s. The tool converts it to the Gaussian `tp` that has the same maximum slope: `tp = √2·e^(−1/2)·p_init / rate ≈ 0.858·p_init / rate`. |
| **Tabulated fairing pressure pe(t)** | Paste the launcher's fairing pressure profile, one point per line as `t [s], p [kPa]`. Commas, semicolons, tabs or spaces all work as separators. Lines that start with `#` are ignored. The data are interpolated linearly, and the pressure is held constant after the last point. The first row sets `p_init`. In this mode `K` uses an *equivalent* `tp`, derived from the steepest slope of the table. |

**Initial pressure p_init [kPa]** is the pressure inside the fairing and the compartment at lift-off. The two are assumed equal. The default is 101.325 kPa; the book example uses 100 kPa.

### 3.2 Compartment & gas

| Input | Notes |
|---|---|
| **Effective internal volume V** | Free gas volume of the compartment, in m³, L or cm³. Walls are rigid (Eq. A.5, footnote 2). |
| **Gas** | Air, nitrogen, helium or *Custom*. Choosing *Custom* unlocks γ and R. |
| **γ, R, T_init** | Specific-heat ratio, gas constant and initial temperature. The tool shows the initial speed of sound `a_init = √(γ R T_init)` (Eq. A.39). |

### 3.3 Venting

Choose how to define the vents:

- **Effective area.** Enter the total vent section **S**, the sum over all vents, in m², cm² or mm². Scientific notation such as `24e-6` is accepted. Also enter the **loss coefficient ξ**:
  - If S is already an *effective* area `C_D·A` (Eq. A.31), keep **ξ = 1**.
  - If S is the *geometric* area, set **ξ ≈ 1/C_D²** (Eq. A.33).
  - Never count the losses twice by doing both.
- **Vent holes.** Enter the number of holes `N`, the diameter in mm and the discharge coefficient `C_D` (0 < C_D ≤ 1, Eq. A.17). The tool computes `S = N·C_D·πd²/4` with ξ = 1. For sharp-edged orifices, C_D ≈ 0.6.

### 3.4 Model & solver

| Input | Notes |
|---|---|
| **Vent flow model** | **Pagani & Carrera, AASS, 2016 — Eqs. (A.22)/(A.24)** (default): compressible orifice flow with choking, i.e. quasi-steady isentropic flow, choked or subcritical, valid at any pressure ratio. **Sanz-Andrés et al., JSR, 1997 — Eq. (A.52)**: incompressible orifice loss law `Δp = ½ρ0·Uh²·ξ` in the compact form `dρ̄/dτ = −√(ρ̄(ρ̄ⁿ − p̄e))`, valid for **small pressure differences** only (see section 6). Both are always computed; the model you don't select is drawn dashed on the Δp chart and listed under *Comparison*. |
| **Thermodynamics** | Isentropic `n = γ` (default), isothermal `n = 1`, or a custom polytropic `n` (Eq. A.9). The two limits bound the real behaviour. The **isothermal case gives the higher peak Δp**: in the UPM-Sat 1 cases, n = 1 raises Δp_max by 14–43 % over n = γ (e.g. 63.5 instead of 55.5 kPa in Case 3), and for K ≪ 1 Δp_max scales as 1/n. For design, check both or use n = 1. |
| **End time [s]** | Leave it blank for the automatic window: `3·tp` (Eq. A.59) for the Gaussian profiles, or the last table time. |
| **Time steps** | Number of steps of the implicit integrator (200–50 000). The solution is already converged at the default of 4000: in the UPM-Sat 1 cases even 200 steps change Δp_max only in the fifth significant figure, so the displayed values do not change. More steps only refine the time grid of the plots and the CSV. The *Numerical check* row of the results table repeats the run with half the steps and shows the difference. |

### 3.5 Structural check & vent sizing (optional)

| Input | Notes |
|---|---|
| **Allowable Δp [kPa]** | Maximum differential pressure the walls can take. Setting it adds a margin of safety and a vent-sizing result, and draws the limit as a red dashed line on the charts. |
| **Design factor FS** | Factor applied to the computed load: design load = `FS·Δp_max`. |
| **Loaded wall area A_w [m²]** | Gives the resultant force on a panel, `F = FS·Δp_max·A_w`. |
| **Sizing hole Ø, sizing C_D** | Hole size used to turn the required area into a number of holes. |

---

## 4. Outputs

### 4.1 Key figures

- **Δp_max** (Eq. A.30) is the largest value of `p0 − pe` during the transient. This is the design value; the difference between initial and final pressure is not. The tile also shows when the peak occurs (`t` and `t/tp`), the dimensionless jump `δ_max = Δp_max/p_init` (Eqs. A.46–A.47), and the load type. Positive Δp means **bursting** (internal pressure higher); negative means **crushing**.
- **tc, the characteristic venting time** (Eq. A.43): `tc = (V / (S·a_init))·√(γξ/2)`. A small `tc` means the compartment vents well. The tile also shows `V/S`.
- **K = tc/tp** (Eq. A.54) compares how fast the compartment vents with how fast the fairing depressurizes. The badge gives an indicative regime:
  - ✓ **Well vented**, K < 0.1: Δp stays small.
  - ⚠ **Transitional**, 0.1 ≤ K < 1.
  - ✕ **Poorly vented**, K ≥ 1: the internal pressure cannot follow the fairing pressure and Δp approaches `p_init`.
- **Sonic phase** (Eqs. A.60–A.61) is the time at which the vents choke (`r = pe/p0 ≤ r_cr`, with `r_cr = (2/(γ+1))^(γ/(γ−1)) ≈ 0.528` for air), and when they unchoke, if that happens inside the window.
- **Design load / margin of safety.** Without an allowable, the tile shows `FS·Δp_max`. With one, it shows `MoS = Δp_allow / (FS·Δp_max) − 1`. A negative MoS means the vents are too small.

### 4.2 Charts

1. **Pressure history**: compartment `p0(t)` against fairing `pe(t)`. The gap between the two curves is the load.
2. **Differential pressure Δp(t)**: the selected model as a solid line, the other model dashed. The peak is labelled, and the sonic phase is shaded amber.
3. **Gas density**: compartment `ρ0(t) = ρ_init·ρ̄` against the fairing gas density `ρe = ρ_init·(pe/p_init)^(1/n)`.
4. **Gas temperature**: compartment `T0(t) = T_init·ρ̄^(n−1)` (Eq. A.13) against the fairing gas `Te = T_init·(pe/p_init)^((n−1)/n)`. Both are flat in the isothermal case (n = 1). These are the temperatures *implied by the polytropic hypothesis*, not physical predictions; see section 7. The fairing curves assume the fairing gas follows the same polytropic law as the compartment.
5. **Sonic-phase check**: `r(t) = pe/p0` against `r_cr`. The shaded band below `r_cr` is the choked regime.
6. **Design chart**: `δ_max` against `K` on log–log axes, for the Gaussian profile with the current γ and n and the same time window. The orange dot marks your design. Use it to see at once how much an extra vent hole would buy. The dotted line is the quasi-static asymptote `δ_max ≈ 4K²/(n·e)`, valid only for K ≪ 1. It follows from Eq. (A.52) when the compartment pressure tracks the fairing pressure. The green and red backgrounds mark the K < 0.1 and K > 1 regions.

### 4.3 Vent sizing

The tool searches, by bisection on the full simulation, for the **smallest effective area S_req** (with ξ = 1) for which `FS·Δp_max = Δp_allow`. It reports:

- S_req, and whether the current area is adequate;
- the number of holes of the sizing diameter and C_D needed;
- `tc` and `K` at S_req.

If Δp never exceeds the allowable within the window, even with almost no venting, the tool says that venting is not critical.

### 4.4 Detailed results table

The table groups every quantity with its symbol and the equation number in A. Pagani et al., Appunti di Strutture per Veicoli Spaziali, PoliTo, 2026:

- **Fairing:** `tp`, `p_init`, maximum depressurization rate and the time at which it occurs.
- **Compartment:** ρ_init, initial gas mass, a_init, n.
- **Venting:** S, ξ and its equivalent C_D, V/S, tc, K, r_cr.
- **Loads:** Δp_max and its time, δ_max, `p0` and `pe` at the peak, compartment temperature at the peak `T0 = T_init·ρ̄^(n−1)`, maximum crushing, sonic intervals, peak vent mass flow rate, gas mass left at the end.
- **Comparison:** the other model's Δp_max, the quasi-static estimate, the numerical check with half the time steps, and the no-venting upper bound `p_init − pe(t_end)`.
- **Structural:** design load, margin of safety, panel force.

### 4.5 Export and sharing

- **Export CSV** downloads `decompression_history.csv`. A commented header lists all parameters. The columns are `t, pe, p0, Δp, ρ0, T0, r, ṁ_out, choked flag, Δp of the other model`, in SI units.
- **Copy link** puts all inputs in the URL after the `#`. Opening that link restores the same case, which is useful for design reviews.
- **Report** opens the browser's print dialog. Choose *Save as PDF* to archive the inputs, charts and tables.

---

## 5. Worked example: UPM-Sat 1 (Sec. A.4.1)

This is the example of Sec. A.4.1 in A. Pagani et al., Appunti di Strutture per Veicoli Spaziali, PoliTo, 2026. Click **UPM-Sat 1 · Case 1/2/3**. The presets load the data of Table A.2: V = 0.13 m³, a_init = 335 m/s, γ = 1.4, ξ = 1, tp = 75 s (Ariane 40), p_init = 100 kPa, isentropic, window 0 ≤ t ≤ 225 s.

| Case | S [m²] | tc [s] (Tab. A.3) | K | Δp_max, Pagani & Carrera | Δp_max, Sanz-Andrés et al. (A.52) | Sonic start (book, Tab. A.4) |
|---|---|---|---|---|---|---|
| 1 | 24×10⁻⁵ | 1.35 | 0.018 | 34 Pa at 89 s | 34 Pa | not reached (not reached) |
| 2 | 24×10⁻⁶ | 13.53 | 0.180 | 3.29 kPa at 95 s | 2.96 kPa | 143 s (≈ 145 s) |
| 3 | 24×10⁻⁷ | 135.28 | 1.80 | 55.5 kPa at 124 s | 45.1 kPa | 69 s (≈ 70 s) |

These values match the curves of Figs. A.5–A.7 and the sonic-phase estimates of Table A.4. In all cases the flow is still choked at 225 s. Reducing S by a factor of 100 raises the peak load by more than three orders of magnitude, which is why the vent design is part of the structural verification.

To re-run these checks from the command line (requires Node.js):

```bash
node tests/verify.js
```

---

## 6. Theory in brief

For a compartment of constant volume V venting into the fairing, with uniform properties (zero-dimensional model):

```
dρ/dt = −ṁ_out / V                          (A.5–A.7)
p/ρⁿ = const                                 (A.9)
Δp(t) = p0(t) − pe(t)                        (A.28)
```

**Pagani & Carrera, AASS, 2016 model: compressible orifice flow with choking**, quasi-steady and isentropic, through an effective area `S/√ξ`:

```
choked      (pe/p0 ≤ r_cr):  ṁ = S p0 √(γ/RT0) · (2/(γ+1))^((γ+1)/(2(γ−1)))                (A.22)
subcritical (pe/p0 > r_cr):  ṁ = S p0 √(2γ/(RT0(γ−1)) · [(pe/p0)^(2/γ) − (pe/p0)^((γ+1)/γ)])  (A.24)
```

**Sanz-Andrés et al., JSR, 1997 model: incompressible orifice loss law (small Δp).** The vent losses are written as the quadratic law `Δp = ½ρ0·Uh²·ξ` (Eq. A.32), with constant density across the vent. The book uses it for small pressure differences (Eq. A.35), giving `ṁ = S·√(2ρ0Δp/ξ)` (Eq. A.36). This law has no sonic limit, and at large Δp it predicts vent velocities above the speed of sound, a sign that it is outside its range of validity: once the vents choke it overestimates the outflow and therefore underestimates Δp (by about 20 % in UPM-Sat 1 Case 3). The gas in the compartment is still compressible in this model; only the vent flow law is incompressible. Calling the two models simply "compressible" and "incompressible" is therefore a shorthand.

**Dimensionless form** (Eqs. A.45–A.52), with `ρ̄ = ρ/ρ_init`, `p̄e = pe/p_init`, `τ = t/tc`:

```
dρ̄/dτ = −√( ρ̄ (ρ̄ⁿ − p̄e) )      (Sanz-Andrés et al. model, Eq. A.52)
Δp    = p_init (ρ̄ⁿ − p̄e)
p̄e    = exp[−(K τ)²],  K = tc/tp  (Eqs. A.53–A.56)
```

In dimensionless form the Pagani & Carrera model becomes `dρ̄/dτ = −√(γ/2)·ρ̄^((n+1)/2)·ψ(p̄e/ρ̄ⁿ)`, where ψ is the orifice flow function. For small Δp it reduces exactly to Eq. (A.52). If the fairing pressure rises above the compartment pressure (reverse flow, possible with tabulated profiles), the same orifice laws apply with the fairing gas upstream.

**Numerics.** The single ODE is integrated with an implicit second-order BDF scheme. Each step is solved by a bracketed root search. This stays stable and accurate both for very well vented compartments (K ≪ 1), where the explicit form of the equations is stiff, and for poorly vented ones.

---

## 7. Limitations

The model is intended for preliminary design and sensitivity studies (A. Pagani et al., Appunti di Strutture per Veicoli Spaziali, PoliTo, 2026, introduction). It assumes:

- a single compartment with uniform properties: no internal pressure waves, stratification or jets. This requires the acoustic transit time to be much shorter than `tc`;
- rigid walls and constant volume;
- a polytropic process: no explicit heat transfer, humidity, condensation or **outgassing**. The computed temperatures follow from this hypothesis and are not physical predictions. With n = γ the gas expands as a reversible adiabatic process, the coldest it could get (about 185 K at the peak of UPM-Sat 1 Case 2). In reality heat from the walls and equipment, humidity, condensation or freezing, viscous losses and incomplete mixing keep it warmer, between the isentropic and isothermal values. The fairing gas temperature is only an assumption (same polytropic law); its real value depends on the launcher. Since n = 1 gives the higher Δp, the isentropic default is not the conservative choice for the load;
- a single equivalent vent. Networks of interconnected compartments (Eq. A.14, Fig. A.2) are not modelled, but you can study each compartment against its neighbour by giving the neighbour's pressure history as a table;
- for the Gaussian presets, an *idealized* fairing profile. The Table A.1 values come from older launchers. For flight hardware, use the fairing pressure envelope from the current launcher user's manual (tabulated or max-rate mode) and apply the required qualification factors.

---

## 8. References

1. A. Pagani, E. Carrera, P. Chiaia, ["Appunti di Strutture per Veicoli Spaziali"](https://alfonsopagani.github.io/svs/), Politecnico di Torino, 2026 (`svsbook_light.pdf`).
2. A. Pagani, E. Carrera, ["Gasdynamics of rapid and explosive decompressions of pressurized aircraft including active venting"](https://alfonsopagani.github.io/svs/papers/pagani_carrera_aas_2016.pdf), *Advances in Aircraft and Spacecraft Science*, 3(1):77–93, 2016.
3. Á. Sanz-Andrés, J. Santiago-Prowald, A. Ayuso-Barea, "Spacecraft Launch Depressurization Loads", *Journal of Spacecraft and Rockets*, 34(6):805–810, 1997.
4. NASA SP-8060, *Compartment Venting*, NASA Space Vehicle Design Criteria (Structures), 1970.
5. V. L. Streeter, E. B. Wylie, *Fluid Mechanics*, McGraw-Hill, 1975.
6. ESA Launch Vehicle Catalogue (source of the `tp` values in Table A.1).

## Repository contents

| File | Description |
|---|---|
| `index.html` | The calculator: a single file with no external dependencies. |
| `tests/verify.js` | Regression check of the embedded solver against the UPM-Sat 1 case. |
| `svsbook_light.pdf` | The textbook: A. Pagani et al., Appunti di Strutture per Veicoli Spaziali, PoliTo, 2026, starting on page 323. |
| `LICENSE` | License. |

---

© 2026 Alfonso Pagani · Built with Claude by Anthropic · Source code on [github.com/alfonsopagani](https://github.com/alfonsopagani)
