export default function sortTable(id) {
	try {
        let tid = `#${id}`
        let headers = document.querySelectorAll(tid + " th")
        headers.forEach(function (element, i) {
            element.classList.add("table-header-sort");
            element.addEventListener("click", function () {
                sortHTML(tid, ".item", "td:nth-child(" + (i + 1) + ")");
            })
        })
    } catch {
        return false;
    }
    return true;
}


function sortHTML(id, sel, sortvalue) {
    var a, b, i, ii, y, bytt, v1, v2, cc, j;

    a = document.querySelectorAll(id)

    for (i = 0; i < a.length; i++) {
      for (j = 0; j < 2; j++) {
        cc = 0;
        y = 1;
        while (y == 1) {
          y = 0;
          b = a[i].querySelectorAll(sel);
          for (ii = 0; ii < (b.length - 1); ii++) {
            bytt = 0;
            if (sortvalue) {
              v1 = b[ii].querySelector(sortvalue).innerText;
              v2 = b[ii + 1].querySelector(sortvalue).innerText;
            } else {
              v1 = b[ii].innerText;
              v2 = b[ii + 1].innerText;
            }
            v1 = v1.toLowerCase();
            v2 = v2.toLowerCase();
            if ((j == 0 && (v1 > v2)) || (j == 1 && (v1 < v2))) {
              bytt = 1;
              break;
            }
          }
          if (bytt == 1) {
            b[ii].parentNode.insertBefore(b[ii + 1], b[ii]);
            y = 1;
            cc++;
          }
        }
        if (cc > 0) {break;}
      }
      
    }
  }